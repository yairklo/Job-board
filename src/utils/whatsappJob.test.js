import { describe, it, expect } from 'vitest';
import { stripDisplayMarks, parseTitleAndCompany, normalizeWhatsAppJob, filterWhatsAppJobs } from './whatsappJob';

describe('whatsappJob', () => {
  describe('stripDisplayMarks', () => {
    it('removes asterisks, RTL marks, and extra spaces', () => {
      expect(stripDisplayMarks('\u200e*Security Engineer* / Salt Security')).toBe('Security Engineer / Salt Security');
    });
  });

  describe('parseTitleAndCompany', () => {
    it('parses Role / Company when company is empty', () => {
      expect(parseTitleAndCompany('\u200e*Security Engineer* / Salt Security', '')).toEqual({
        title: 'Security Engineer',
        company: 'Salt Security',
      });
    });

    it('prefers feed company when present', () => {
      expect(parseTitleAndCompany('*Role* / Other', 'Acme')).toEqual({
        title: 'Role / Other',
        company: 'Acme',
      });
    });

    it('keeps Hebrew free text as title when there is no slash pattern', () => {
      const hebrew = 'משרת ג\'וניור לפיתוח Full Stack במעבדת מחקר';
      expect(parseTitleAndCompany(hebrew, '')).toEqual({
        title: hebrew,
        company: '',
      });
    });
  });

  describe('normalizeWhatsAppJob', () => {
    it('maps collector fields and fills webify placeholders', () => {
      const normalized = normalizeWhatsAppJob({
        id: 'a906d4d5cb6e3a93d239ea7b45a983ba',
        fingerprint: 'a906d4d5cb6e3a93d239ea7b45a983ba',
        title: '\u200e*Security Engineer* / Salt Security',
        company: '',
        group: 'Referally Junior 1-2 🐊',
        applyUrl: 'https://www.linkedin.com/jobs/view/4448855970',
        status: 'awaiting_approval',
        approvalStatus: 'pending',
        createdAt: '2026-09-02T18:12:56.587Z',
        source: 'whatsapp_group',
      });

      expect(normalized._id).toBe('a906d4d5cb6e3a93d239ea7b45a983ba');
      expect(normalized.title).toBe('Security Engineer');
      expect(normalized.company).toBe('Salt Security');
      expect(normalized.group).toBe('Referally Junior 1-2 🐊');
      expect(normalized.applyUrl).toBe('https://www.linkedin.com/jobs/view/4448855970');
      expect(normalized.applicationUrl).toBe(normalized.applyUrl);
      expect(normalized.status).toBe('awaiting_approval');
      expect(normalized.location).toBe('—');
      expect(normalized.jobType).toBe('—');
      expect(normalized.salary).toBeNull();
      expect(normalized.savedBy).toEqual([]);
    });

    it('does not crash when most fields are missing', () => {
      const normalized = normalizeWhatsAppJob({});
      expect(normalized.title).toBe('Untitled job');
      expect(normalized.company).toBe('—');
      expect(normalized.group).toBe('—');
      expect(normalized.applyUrl).toBe('');
    });
  });

  describe('filterWhatsAppJobs', () => {
    const jobs = [
      { title: 'Security Engineer', company: 'Salt Security', group: 'Referally Junior 1-2 🐊', status: 'awaiting_approval', approvalStatus: 'pending' },
      { title: 'משרת ג׳וניור', company: '—', group: 'מדמ"ח - נטוורקינג ומשרות', status: 'awaiting_approval', approvalStatus: 'pending' },
    ];

    it('searches title, company, and group', () => {
      expect(filterWhatsAppJobs(jobs, { search: 'salt' })).toHaveLength(1);
      expect(filterWhatsAppJobs(jobs, { search: 'מדמ' })).toHaveLength(1);
    });

    it('filters by group and status', () => {
      expect(filterWhatsAppJobs(jobs, { group: 'Referally Junior 1-2 🐊' })).toHaveLength(1);
      expect(filterWhatsAppJobs(jobs, { status: 'pending' })).toHaveLength(2);
    });

    it('filters by date added', () => {
      const datedJobs = [
        { title: 'New', company: 'A', group: 'G', createdAt: new Date().toISOString() },
        { title: 'Old', company: 'B', group: 'G', createdAt: '2020-01-01T00:00:00.000Z' },
      ];
      expect(filterWhatsAppJobs(datedJobs, { dateAdded: '7' })).toHaveLength(1);
      expect(filterWhatsAppJobs(datedJobs, { dateAdded: '7' })[0].title).toBe('New');
    });
  });
});
