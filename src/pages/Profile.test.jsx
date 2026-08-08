import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { useAuth } from '../contexts/AuthContext';
import * as usersService from '../services/usersService';
import { toast } from 'react-toastify';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../services/usersService', () => ({
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
  toggleRecruiterRole: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUser = {
  _id: 'user123',
  isRecruiter: false,
};

const mockProfileData = {
  name: { first: 'John', middle: '', last: 'Doe' },
  phone: '0501234567',
  email: 'john@example.com',
  address: {
    state: '',
    country: 'Israel',
    city: 'Tel Aviv',
    street: 'Dizengoff',
    houseNumber: 10,
    zip: 12345
  },
  image: { url: '', alt: '' },
  isRecruiter: false
};

const renderProfile = () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
};

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the useAuth hook to return our mockUser
    useAuth.mockReturnValue({
      user: mockUser,
      logout: vi.fn(),
    });
  });

  it('renders loading initially and fetches profile', async () => {
    usersService.getUserProfile.mockResolvedValueOnce(mockProfileData);
    renderProfile();
    
    // Expect service to be called
    await waitFor(() => {
      expect(usersService.getUserProfile).toHaveBeenCalledWith('user123');
    });

    // Form fields should be populated
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
  });

  it('displays error if fetch fails', async () => {
    usersService.getUserProfile.mockRejectedValueOnce(new Error('Fetch failed'));
    renderProfile();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load profile data');
    });
  });
});
