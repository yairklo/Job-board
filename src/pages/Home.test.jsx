import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Home from './Home';
import * as jobsService from '../services/jobsService';

vi.mock('../services/jobsService');

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { _id: '1' }, isLoggedIn: true })
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  it('fetches and displays jobs', async () => {
    const mockJobs = [
      { _id: '1', title: 'React Developer', company: 'Tech Inc', category: 'IT', location: 'Remote', jobType: 'Full-Time', experienceLevel: 'Mid-Level', createdAt: new Date().toISOString() },
      { _id: '2', title: 'Node Developer', company: 'Backend Corp', category: 'IT', location: 'NY', jobType: 'Part-Time', experienceLevel: 'Junior', createdAt: new Date().toISOString() }
    ];
    jobsService.getAllJobs.mockResolvedValueOnce(mockJobs);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('React Developer')).toBeInTheDocument();
      expect(screen.getByText('Node Developer')).toBeInTheDocument();
    });
  });

  it('displays empty state when no jobs', async () => {
    jobsService.getAllJobs.mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No jobs found/i)).toBeInTheDocument();
    });
  });

  it('filters jobs by date added', async () => {
    jobsService.getAllJobs.mockResolvedValueOnce([
      { _id: '1', title: 'New Role', company: 'A', createdAt: new Date().toISOString() },
      { _id: '2', title: 'Old Role', company: 'B', createdAt: '2020-01-01T00:00:00.000Z' },
    ]);

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('New Role')).toBeInTheDocument();
      expect(screen.getByText('Old Role')).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText('Filter by date added'), 'Last 7 days');
    expect(screen.getByText('New Role')).toBeInTheDocument();
    expect(screen.queryByText('Old Role')).not.toBeInTheDocument();
  });
});
