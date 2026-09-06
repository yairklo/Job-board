import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDistanceToNow, matchesDateAdded } from './date-utils';

describe('formatDistanceToNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should format seconds correctly', () => {
    const date = new Date('2024-01-01T11:59:30.000Z');
    expect(formatDistanceToNow(date)).toBe('Just now');
  });

  it('should format minutes correctly', () => {
    const date = new Date('2024-01-01T11:55:00.000Z');
    expect(formatDistanceToNow(date)).toBe('5m ago');
  });

  it('should format hours correctly', () => {
    const date = new Date('2024-01-01T09:00:00.000Z');
    expect(formatDistanceToNow(date)).toBe('3h ago');
  });

  it('should format days correctly', () => {
    const date = new Date('2023-12-28T12:00:00.000Z');
    expect(formatDistanceToNow(date)).toBe('4d ago');
  });

  it('should format months correctly', () => {
    const date = new Date('2023-11-01T12:00:00.000Z');
    expect(formatDistanceToNow(date)).toBe('2mo ago');
  });

  it('should format years correctly', () => {
    const date = new Date('2022-01-01T12:00:00.000Z');
    expect(formatDistanceToNow(date)).toBe('2y ago');
  });
});

describe('matchesDateAdded', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-06T15:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts any date when no range is selected', () => {
    expect(matchesDateAdded('2020-01-01T00:00:00.000Z', '')).toBe(true);
  });

  it('keeps jobs added today', () => {
    const now = new Date();
    expect(matchesDateAdded(now.toISOString(), 'today')).toBe(true);
    expect(matchesDateAdded(new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(), 'today')).toBe(false);
  });

  it('keeps jobs added within the last 7 days', () => {
    const now = new Date();
    expect(matchesDateAdded(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), '7')).toBe(true);
    expect(matchesDateAdded(new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), '7')).toBe(false);
  });
});
