import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import WhatsAppFeed from './WhatsAppFeed';
import * as jobsService from '../services/jobsService';

vi.mock('../services/jobsService');

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { _id: '1' }, isLoggedIn: true })
}));

describe('WhatsApp Feed Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <WhatsAppFeed />
    </BrowserRouter>
  );

  it('filters by search text and WhatsApp group', async () => {
    const mockJobs = [
      { _id: '1', title: 'Security Engineer', company: 'Salt Security', group: 'Referally Junior 1-2 🐊', status: 'awaiting_approval', createdAt: new Date().toISOString() },
      { _id: '2', title: 'Full Stack', company: '—', group: 'מדמ"ח - נטוורקינג ומשרות', status: 'awaiting_approval', createdAt: new Date().toISOString() },
    ];
    jobsService.getRecentJobs.mockResolvedValueOnce({ jobs: mockJobs, total: 2 });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Security Engineer')).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText('Filter by WhatsApp group'), 'Referally Junior 1-2 🐊');
    expect(screen.getByText('Security Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Full Stack')).not.toBeInTheDocument();
  });
});
