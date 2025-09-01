import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('renders title correctly', () => {
    render(<Header title="CI/CD Platform" />);
    
    expect(screen.getByText('CI/CD Platform')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<Header title="CI/CD Platform" subtitle="Automation Made Easy" />);
    
    expect(screen.getByText('CI/CD Platform')).toBeInTheDocument();
    expect(screen.getByText('Automation Made Easy')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<Header title="CI/CD Platform" />);
    
    expect(screen.getByText('CI/CD Platform')).toBeInTheDocument();
    expect(screen.queryByText('Automation Made Easy')).not.toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(<Header title="CI/CD Platform" />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-blue-600', 'text-white', 'p-6', 'shadow-lg');
  });
});
