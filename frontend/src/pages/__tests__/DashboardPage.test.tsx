import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../DashboardPage';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'developer' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DashboardPage Component', () => {
  it('renders dashboard title correctly', () => {
    renderWithRouter(<DashboardPage />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays welcome message with user name', () => {
    renderWithRouter(<DashboardPage />);
    
    expect(screen.getByText(/Welcome back, Test User/)).toBeInTheDocument();
  });

  it('shows pipeline statistics section', () => {
    renderWithRouter(<DashboardPage />);
    
    expect(screen.getByText('Pipeline Statistics')).toBeInTheDocument();
    expect(screen.getByText('Active Pipelines')).toBeInTheDocument();
    expect(screen.getByText('Total Deployments')).toBeInTheDocument();
  });

  it('displays recent activity section', () => {
    renderWithRouter(<DashboardPage />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('shows quick actions section', () => {
    renderWithRouter(<DashboardPage />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Create Pipeline')).toBeInTheDocument();
    expect(screen.getByText('View Metrics')).toBeInTheDocument();
  });

  it('has correct CSS classes for layout', () => {
    renderWithRouter(<DashboardPage />);
    
    const dashboard = screen.getByTestId('dashboard-page');
    expect(dashboard).toHaveClass('min-h-screen', 'bg-gray-50');
  });
});


