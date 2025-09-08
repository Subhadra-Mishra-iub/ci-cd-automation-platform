import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders loading spinner correctly', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    render(<LoadingSpinner size="lg" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with default size when no size provided', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('has correct CSS classes for animation', () => {
    render(<LoadingSpinner />);
    
    const spinnerIcon = screen.getByRole('status').querySelector('div');
    expect(spinnerIcon).toHaveClass('animate-spin');
  });

  it('shows spinner icon with correct styling', () => {
    render(<LoadingSpinner />);
    
    const spinnerIcon = screen.getByRole('status').querySelector('div');
    expect(spinnerIcon).toHaveClass('w-8', 'h-8', 'rounded-full', 'border-4');
  });
});


