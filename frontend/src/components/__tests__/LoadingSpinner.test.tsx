import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders loading spinner correctly', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom message when provided', () => {
    render(<LoadingSpinner message="Loading pipelines..." />);
    
    expect(screen.getByText('Loading pipelines...')).toBeInTheDocument();
  });

  it('renders default message when no message provided', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has correct CSS classes for animation', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('shows spinner icon', () => {
    render(<LoadingSpinner />);
    
    const icon = screen.getByTestId('spinner-icon');
    expect(icon).toBeInTheDocument();
  });
});


