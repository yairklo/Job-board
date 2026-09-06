import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import * as AuthContextModule from '../contexts/AuthContext';
import * as ThemeContextModule from '../contexts/ThemeContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    ThemeContextModule.useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: vi.fn() });
  });

  it('renders guest links when not logged in', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: false });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('WebifyJobs')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Feed')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Saved Jobs')).not.toBeInTheDocument();
  });

  it('renders logged in user links', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, logout: vi.fn() });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Saved Jobs')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('renders recruiter links', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, isRecruiter: true });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('My Jobs')).toBeInTheDocument();
  });

  it('renders admin links', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, isAdmin: true });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('calls logout on logout button click', () => {
    const logoutMock = vi.fn();
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, logout: logoutMock });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(logoutMock).toHaveBeenCalled();
  });
});
