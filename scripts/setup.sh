#!/bin/bash

# CI/CD Automation Platform Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up CI/CD Automation Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Some features may not work"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. Some features may not work"
    fi
    
    print_success "System requirements check completed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Create environment file
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cp env.example .env
        print_warning "Please edit backend/.env with your configuration"
    fi
    
    # Create logs directory
    mkdir -p logs
    
    cd ..
    print_success "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create environment file
    if [ ! -f .env ]; then
        print_status "Creating frontend environment file..."
        cp env.example .env
        print_warning "Please edit frontend/.env with your configuration"
    fi
    
    cd ..
    print_success "Frontend setup completed"
}

# Setup Docker
setup_docker() {
    print_status "Setting up Docker configuration..."
    
    # Create necessary directories
    mkdir -p docker/ssl
    mkdir -p docker/grafana/provisioning/datasources
    mkdir -p docker/grafana/provisioning/dashboards
    
    print_success "Docker setup completed"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Create .git/hooks directory if it doesn't exist
    mkdir -p .git/hooks
    
    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "Running pre-commit checks..."

# Run linting
echo "Running backend linting..."
cd backend && npm run lint

echo "Running frontend linting..."
cd ../frontend && npm run lint

# Run type checking
echo "Running backend type check..."
cd ../backend && npm run type-check

echo "Running frontend type check..."
cd ../frontend && npm run type-check

echo "Pre-commit checks completed successfully!"
EOF
    
    chmod +x .git/hooks/pre-commit
    print_success "Git hooks setup completed"
}

# Main setup function
main() {
    print_status "Starting CI/CD Automation Platform setup..."
    
    # Check requirements
    check_requirements
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Setup Docker
    setup_docker
    
    # Setup Git hooks
    setup_git_hooks
    
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit backend/.env with your configuration"
    echo "2. Edit frontend/.env with your configuration"
    echo "3. Start the application:"
    echo "   - Development: docker-compose up -d"
    echo "   - Or run individually:"
    echo "     cd backend && npm run dev"
    echo "     cd frontend && npm run dev"
    echo ""
    echo "Access the application:"
    echo "- Frontend: http://localhost:3001"
    echo "- Backend API: http://localhost:3000"
    echo "- API Documentation: http://localhost:3000/api"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
