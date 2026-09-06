import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import JobCard from './JobCard';
import * as AuthContextModule from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockJob = {
  _id: '123',
  title: 'Software Engineer',
  company: 'Tech Corp',
  location: 'Tel Aviv',
  jobType: 'Full-time',
  salary: { min: 10000, max: 20000 },
  experienceLevel: 'Mid',
  createdAt: new Date().toISOString(),
  recruiter_id: 'recruiter1',
  savedBy: ['user1'],
};

const whatsappJob = {
  _id: 'a906d4d5cb6e3a93d239ea7b45a983ba',
  title: 'Security Engineer',
  company: 'Salt Security',
  group: 'Referally Junior 1-2 🐊',
  location: '—',
  jobType: '—',
  salary: null,
  experienceLevel: '—',
  status: 'awaiting_approval',
  applyUrl: 'https://www.linkedin.com/jobs/view/4448855970',
  createdAt: '2026-09-02T18:12:56.587Z',
  recruiter_id: null,
  savedBy: [],
};

describe('JobCard', () => {
  it('renders job details correctly', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: false });

    render(
      <MemoryRouter>
        <JobCard job={mockJob} />
      </MemoryRouter>
    );

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Tel Aviv')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('10,000 - 20,000 ILS')).toBeInTheDocument();
    expect(screen.getByText('Mid')).toBeInTheDocument();
  });

  it('renders WhatsApp jobs without salary or location', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: false });

    render(
      <MemoryRouter>
        <JobCard job={whatsappJob} />
      </MemoryRouter>
    );

    expect(screen.getByText('Security Engineer')).toBeInTheDocument();
    expect(screen.getByText('Salt Security')).toBeInTheDocument();
    expect(screen.getAllByText('Referally Junior 1-2 🐊').length).toBeGreaterThan(0);
    expect(screen.getByText('Apply link available')).toBeInTheDocument();
    expect(screen.queryByText(/ILS/)).not.toBeInTheDocument();
  });

  it('shows save button when logged in and not the recruiter', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, user: { _id: 'user2' } });

    render(
      <MemoryRouter>
        <JobCard job={mockJob} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });

  it('shows edit and delete buttons for admin', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, isAdmin: true, user: { _id: 'admin' } });

    render(
      <MemoryRouter>
        <JobCard job={mockJob} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  it('calls onSave when save button is clicked', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, user: { _id: 'user2' } });
    const handleSave = vi.fn();

    render(
      <MemoryRouter>
        <JobCard job={mockJob} onSave={handleSave} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleSave).toHaveBeenCalledWith('123');
  });

  it('calls onEdit and onDelete when buttons are clicked', () => {
    AuthContextModule.useAuth.mockReturnValue({ isLoggedIn: true, isAdmin: true, user: { _id: 'admin' } });
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <MemoryRouter>
        <JobCard job={mockJob} onEdit={handleEdit} onDelete={handleDelete} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(handleEdit).toHaveBeenCalledWith('123');

    fireEvent.click(buttons[2]);
    expect(handleDelete).toHaveBeenCalledWith('123');
  });
});
