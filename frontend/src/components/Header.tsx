import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-blue-600 text-white p-6 shadow-lg">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-blue-100 mt-2 text-lg">{subtitle}</p>
        )}
      </div>
    </header>
  );
};
