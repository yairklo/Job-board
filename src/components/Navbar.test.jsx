import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import * as ThemeContextModule from '../contexts/ThemeContext';

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    ThemeContextModule.useTheme.mockReturnValue({ isDarkMode: false, toggleTheme: vi.fn() });
  });

  it('renders the personal feed links and hides webify auth', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Job Feed')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    expect(screen.queryByText('Saved Jobs')).not.toBeInTheDocument();
    expect(screen.queryByText('My Jobs')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });
});
