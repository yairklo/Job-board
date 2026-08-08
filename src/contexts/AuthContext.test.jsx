import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

const TestComponent = () => {
  const { user, isLoggedIn, login, logout, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="isLoggedIn">{isLoggedIn.toString()}</div>
      {user && <div data-testid="userId">{user._id}</div>}
      <button onClick={() => login('fake_token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts with logged out state if no token', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
  });

  it('logs in successfully with valid token', () => {
    jwtDecode.mockReturnValue({ _id: '123', exp: (Date.now() / 1000) + 3600 });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Login'));
    
    expect(localStorage.getItem('token')).toBe('fake_token');
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    expect(screen.getByTestId('userId')).toHaveTextContent('123');
  });

  it('logs out successfully', () => {
    jwtDecode.mockReturnValue({ _id: '123', exp: (Date.now() / 1000) + 3600 });
    localStorage.setItem('token', 'initial_token');
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true');
    
    fireEvent.click(screen.getByText('Logout'));
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false');
  });
});
