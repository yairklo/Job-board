import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Login from './Login';
import * as usersService from '../services/usersService';
import { toast } from 'react-toastify';

vi.mock('../services/usersService');
vi.mock('react-toastify');

const mockLogin = vi.fn();
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin })
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  it('renders form fields', () => {
    renderComponent();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    await waitFor(() => {
      expect(usersService.loginUser).not.toHaveBeenCalled();
    });
  });

  it('calls loginUser on successful submission', async () => {
    usersService.loginUser.mockResolvedValueOnce('fake-token');
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Test1234!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(usersService.loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'Test1234!' });
      expect(mockLogin).toHaveBeenCalledWith('fake-token');
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });
});
