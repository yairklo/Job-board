import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jobsFeedClient } from './apiClient';
import { getAllJobs, getJobById, getRecentJobs } from './jobsService';
import { clearCachedJobs } from './jobsCache';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
  },
  jobsFeedClient: {
    get: vi.fn(),
  },
}));

const sampleJob = {
  id: 'abc123',
  title: '*Security Engineer* / Salt Security',
  company: '',
  group: 'Referally Junior 1-2 🐊',
  applyUrl: 'https://example.com/apply',
  status: 'awaiting_approval',
  approvalStatus: 'pending',
  createdAt: '2026-09-02T18:12:56.587Z',
  source: 'whatsapp_group',
};

describe('jobsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCachedJobs();
  });

  it('loads recent jobs from /api/jobs/recent and normalizes them', async () => {
    jobsFeedClient.get.mockResolvedValueOnce({
      data: { ok: true, jobs: [sampleJob], total: 1, source: 'mongo+jobdb' },
    });

    const jobs = await getAllJobs({ limit: 80 });

    expect(jobsFeedClient.get).toHaveBeenCalledWith('/api/jobs/recent', { params: { limit: 80 } });
    expect(jobs[0]._id).toBe('abc123');
    expect(jobs[0].title).toBe('Security Engineer');
    expect(jobs[0].company).toBe('Salt Security');
  });

  it('resolves job details from the in-memory recent cache', async () => {
    jobsFeedClient.get.mockResolvedValueOnce({
      data: { ok: true, jobs: [sampleJob], total: 1 },
    });

    await getRecentJobs();
    const job = await getJobById('abc123');

    expect(jobsFeedClient.get).toHaveBeenCalledTimes(1);
    expect(job.title).toBe('Security Engineer');
    expect(job.applyUrl).toBe('https://example.com/apply');
  });

  it('refetches recent jobs when the id is not cached', async () => {
    jobsFeedClient.get.mockResolvedValueOnce({
      data: { ok: true, jobs: [sampleJob], total: 1 },
    });

    const job = await getJobById('abc123');

    expect(jobsFeedClient.get).toHaveBeenCalledTimes(1);
    expect(job._id).toBe('abc123');
  });

  it('throws when the id is not in the recent feed', async () => {
    jobsFeedClient.get.mockResolvedValueOnce({
      data: { ok: true, jobs: [sampleJob], total: 1 },
    });

    await expect(getJobById('missing')).rejects.toThrow('Job not found');
  });
});
