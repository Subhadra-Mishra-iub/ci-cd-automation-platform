import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication - in real app, check localStorage or API
    const mockUser: User = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'developer'
    };
    
    setUser(mockUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, call API with email and password
    console.log(`Login attempt for ${email} with password length: ${password.length}`);
    const mockUser: User = {
      id: '123',
      name: 'Test User',
      email,
      role: 'developer'
    };
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, loading, login, logout };
};
