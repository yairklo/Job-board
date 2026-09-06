import React from 'react';
import { FiGlobe, FiPhone, FiMail, FiUsers, FiClock } from 'react-icons/fi';

const JobDetailsSidebar = ({ job }) => {
  const applyUrl = job.applyUrl || job.applicationUrl;
  const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleString() : '—';

  return (
    <div className="d-flex flex-column gap-4">
      <div className="bg-light p-4 rounded-4 border">
        <h3 className="h6 fw-bold text-body mb-3">Job Overview</h3>
        <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
          <li>
            <div className="small text-secondary mb-1">WhatsApp group</div>
            <div className="fw-medium text-body" dir="auto">{job.group || job.category || '—'}</div>
          </li>
          <li>
            <div className="small text-secondary mb-1">Status</div>
            <div className="fw-medium text-body">{job.status || '—'}</div>
          </li>
          <li>
            <div className="small text-secondary mb-1">Approval</div>
            <div className="fw-medium text-body">{job.approvalStatus || '—'}</div>
          </li>
          <li>
            <div className="small text-secondary mb-1">Source</div>
            <div className="fw-medium text-body">{job.source || 'whatsapp_group'}</div>
          </li>
          <li>
            <div className="small text-secondary mb-1">Collected</div>
            <div className="fw-medium text-body d-flex align-items-center gap-2">
              <FiClock className="text-muted" /> {postedDate}
            </div>
          </li>
          {job.experienceLevel && job.experienceLevel !== '—' && (
            <li>
              <div className="small text-secondary mb-1">Experience Level</div>
              <div className="fw-medium text-body">{job.experienceLevel}</div>
            </li>
          )}
          {job.jobNumber && (
            <li>
              <div className="small text-secondary mb-1">Job id</div>
              <div className="fw-medium text-body text-break">{job.id || job.jobNumber}</div>
            </li>
          )}
        </ul>
      </div>

      {(job.email || job.phone || applyUrl) && (
        <div className="bg-primary bg-opacity-10 p-4 rounded-4 border border-primary border-opacity-25">
          <h3 className="h6 fw-bold text-primary mb-3">Apply</h3>
          <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
            {job.email && (
              <li className="d-flex align-items-center text-body">
                <FiMail className="me-3 text-primary" />
                <a href={`mailto:${job.email}`} className="text-decoration-none text-body custom-hover text-truncate">{job.email}</a>
              </li>
            )}
            {job.phone && (
              <li className="d-flex align-items-center text-body">
                <FiPhone className="me-3 text-primary" />
                <a href={`tel:${job.phone}`} className="text-decoration-none text-body custom-hover">{job.phone}</a>
              </li>
            )}
            {applyUrl && (
              <li className="d-flex align-items-center text-body">
                <FiGlobe className="me-3 text-primary" />
                <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-body custom-hover text-truncate">Open apply link</a>
              </li>
            )}
            {job.group && (
              <li className="d-flex align-items-center text-body">
                <FiUsers className="me-3 text-primary" />
                <span dir="auto">{job.group}</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {applyUrl && (
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-100 py-3 fw-medium"
        >
          Apply Now
        </a>
      )}
    </div>
  );
};

export default JobDetailsSidebar;
