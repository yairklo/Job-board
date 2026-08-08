import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CreateEditJob from './CreateEditJob';
import * as jobsService from '../services/jobsService';
import { toast } from 'react-toastify';

vi.mock('../services/jobsService');
vi.mock('react-toastify');

describe('CreateEditJob Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <Routes>
        <Route path="/job/:id" element={<CreateEditJob />} />
        <Route path="/create" element={<CreateEditJob />} />
      </Routes>
    </BrowserRouter>
  );

  it('renders create job form and submits', async () => {
    window.history.pushState({}, 'Test page', '/create');
    jobsService.createJob.mockResolvedValueOnce({});
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Create New Job/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Job Title \*/i), { target: { value: 'Frontend Developer' } });
    fireEvent.change(screen.getByLabelText(/Company Name \*/i), { target: { value: 'Google' } });
    fireEvent.change(screen.getByLabelText(/Job Description \*/i), { target: { value: 'Good job' } });
    fireEvent.change(screen.getByLabelText(/Category \*/i), { target: { value: 'IT' } });
    fireEvent.change(screen.getByLabelText(/Location \*/i), { target: { value: 'Tel Aviv' } });
    fireEvent.change(screen.getByLabelText(/Job Type \*/i), { target: { value: 'Full-Time' } });
    fireEvent.change(screen.getByLabelText(/Experience Level \*/i), { target: { value: 'Junior' } });
    fireEvent.change(screen.getByLabelText(/Minimum Salary \(ILS\) \*/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/Maximum Salary \(ILS\) \*/i), { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText(/Contact Phone \*/i), { target: { value: '0501234567' } });
    fireEvent.change(screen.getByLabelText(/Contact Email \*/i), { target: { value: 'hr@google.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Post Job/i }));

    await waitFor(() => {
      expect(jobsService.createJob).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Job created successfully');
    });
  });

  it('renders edit job form with data', async () => {
    window.history.pushState({}, 'Test page', '/job/1');
    jobsService.getJobById.mockResolvedValueOnce({
      _id: '1', title: 'Backend Dev', company: 'Meta', description: 'desc', category: 'IT', location: 'NY', jobType: 'Full-Time', experienceLevel: 'Senior', salary: { min: 30000, max: 40000 }, contact: { phone: '0501234567', email: 'hr@meta.com' }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Edit Job Posting/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Backend Dev')).toBeInTheDocument();
    });
  });
});
