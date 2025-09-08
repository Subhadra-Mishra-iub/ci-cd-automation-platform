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

  it('displays dashboard statistics', () => {
    renderWithRouter(<DashboardPage />);

    expect(screen.getByText('Active Pipelines')).toBeInTheDocument();
    expect(screen.getByText('Recent Deployments')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('shows correct statistics values', () => {
    renderWithRouter(<DashboardPage />);

    expect(screen.getByText('12')).toBeInTheDocument(); // Active Pipelines
    expect(screen.getByText('8')).toBeInTheDocument();  // Recent Deployments
    expect(screen.getByText('94%')).toBeInTheDocument(); // Success Rate
  });

  it('has correct CSS classes for layout', () => {
    renderWithRouter(<DashboardPage />);

    const dashboard = screen.getByText('Dashboard').closest('div');
    expect(dashboard).toHaveClass('space-y-6');
  });
});


