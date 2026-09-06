import { matchesDateAdded } from './date-utils';

const INVISIBLE_MARKS = /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

export const stripDisplayMarks = (value) =>
  String(value ?? '')
    .replace(INVISIBLE_MARKS, '')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const parseTitleAndCompany = (rawTitle, feedCompany) => {
  const cleanedTitle = stripDisplayMarks(rawTitle);
  const companyFromFeed = stripDisplayMarks(feedCompany);

  if (companyFromFeed) {
    return { title: cleanedTitle || 'Untitled job', company: companyFromFeed };
  }

  const parts = cleanedTitle.split(/\s+\/\s+/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      title: parts[0],
      company: parts.slice(1).join(' / '),
    };
  }

  return { title: cleanedTitle || 'Untitled job', company: '' };
};

const placeholder = (value, fallback = '—') => {
  const cleaned = stripDisplayMarks(value);
  return cleaned || fallback;
};

export const normalizeWhatsAppJob = (job = {}) => {
  const { title, company } = parseTitleAndCompany(job.title, job.company);
  const group = stripDisplayMarks(job.group);
  const applyUrl = typeof job.applyUrl === 'string' ? job.applyUrl.trim() : '';
  const id = job.id || job.fingerprint || job._id || '';
  const cleanedRawTitle = stripDisplayMarks(job.title);

  const description = cleanedRawTitle && cleanedRawTitle !== title
    ? cleanedRawTitle
    : group
      ? `Collected from WhatsApp group: ${group}`
      : 'Job collected from WhatsApp.';

  return {
    _id: id,
    id,
    fingerprint: job.fingerprint || id,
    title,
    company: company || '—',
    group: group || '—',
    applyUrl,
    applicationUrl: applyUrl,
    status: job.status || '',
    approvalStatus: job.approvalStatus || '',
    submittedAt: job.submittedAt || '',
    createdAt: job.createdAt || '',
    updatedAt: job.updatedAt || '',
    source: job.source || 'whatsapp_group',
    location: placeholder(job.location),
    jobType: placeholder(job.jobType),
    experienceLevel: placeholder(job.experienceLevel),
    salary: job.salary && typeof job.salary === 'object' ? job.salary : null,
    description,
    category: group || 'WhatsApp',
    image: { url: '', alt: company || title },
    savedBy: Array.isArray(job.savedBy) ? job.savedBy : [],
    recruiter_id: job.recruiter_id || null,
    email: job.email || '',
    phone: job.phone || '',
    jobNumber: id ? String(id).slice(0, 8) : '',
  };
};

export const filterWhatsAppJobs = (jobs, { search = '', group = '', status = '', dateAdded = '' } = {}) => {
  const searchLower = search.trim().toLowerCase();
  const groupFilter = group.trim();
  const statusFilter = status.trim();

  return jobs.filter((job) => {
    const matchesSearch =
      !searchLower ||
      [job.title, job.company, job.group, job.status, job.approvalStatus]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(searchLower));

    const matchesGroup = !groupFilter || job.group === groupFilter;
    const matchesStatus =
      !statusFilter ||
      job.status === statusFilter ||
      job.approvalStatus === statusFilter;

    return matchesSearch && matchesGroup && matchesStatus && matchesDateAdded(job.createdAt, dateAdded);
  });
};
