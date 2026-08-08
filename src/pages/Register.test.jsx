import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Register from './Register';
import * as usersService from '../services/usersService';
import { toast } from 'react-toastify';

vi.mock('../services/usersService');
vi.mock('react-toastify');

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  it('renders form fields', () => {
    renderComponent();
    expect(screen.getByLabelText(/First Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('calls registerUser on successful submission', async () => {
    usersService.registerUser.mockResolvedValueOnce({});
    renderComponent();

    fireEvent.change(screen.getByLabelText(/First Name \*/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name \*/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Phone \*/i), { target: { value: '0501234567' } });
    fireEvent.change(screen.getByLabelText(/Email Address \*/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password \*/i), { target: { value: 'Test1234!' } });
    fireEvent.change(screen.getByLabelText(/Country \*/i), { target: { value: 'Israel' } });
    fireEvent.change(screen.getByLabelText(/City \*/i), { target: { value: 'Tel Aviv' } });
    fireEvent.change(screen.getByLabelText(/Street \*/i), { target: { value: 'Dizengoff' } });
    fireEvent.change(screen.getByLabelText(/House Number \*/i), { target: { value: '1' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(usersService.registerUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Please login.');
    });
  });
});
