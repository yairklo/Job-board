import React from 'react';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiBookmark, FiEdit, FiTrash2, FiUsers, FiExternalLink } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { formatDistanceToNow } from '../utils/date-utils';

const formatSalary = (salary) => {
  if (salary?.min == null && salary?.max == null) return '—';
  const min = salary.min != null ? salary.min.toLocaleString() : 'N/A';
  const max = salary.max != null ? salary.max.toLocaleString() : 'N/A';
  return `${min} - ${max} ILS`;
};

const JobDetailsHeader = ({ job, isSaved, isLoggedIn, user, isRecruiter, isAdmin, canEdit, canDelete, handleSave, navigate, setIsDeleteModalOpen }) => {
  const applyUrl = job.applyUrl || job.applicationUrl;
  const groupLabel = job.group && job.group !== '—' ? job.group : null;

  return (
    <div className="p-4 p-md-5 border-bottom d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-4">
      <div className="d-flex align-items-start gap-4 flex-grow-1">
        <div className="flex-shrink-0 bg-light rounded-4 d-flex align-items-center justify-content-center overflow-hidden shadow-sm border" style={{ width: '80px', height: '80px' }}>
          {job.image?.url ? (
            <img src={job.image.url} alt={job.image.alt || job.company} className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <FiBriefcase className="text-secondary fs-1" />
          )}
        </div>
        <div>
          <h1 className="h2 fw-bold text-body mb-2" dir="auto">{job.title}</h1>
          <p className="h5 text-primary fw-medium mb-3" dir="auto">{job.company || '—'}</p>

          <div className="d-flex flex-wrap gap-3 text-secondary small">
            {groupLabel && (
              <span className="d-flex align-items-center" dir="auto"><FiUsers className="me-1" /> {groupLabel}</span>
            )}
            {job.location && job.location !== '—' && (
              <span className="d-flex align-items-center"><FiMapPin className="me-1" /> {job.location}</span>
            )}
            {job.jobType && job.jobType !== '—' && (
              <span className="d-flex align-items-center"><FiBriefcase className="me-1" /> {job.jobType}</span>
            )}
            {job.status && (
              <span className="d-flex align-items-center"><FiBriefcase className="me-1" /> {job.status}</span>
            )}
            {(job.salary?.min != null || job.salary?.max != null) && (
              <span className="d-flex align-items-center"><FiDollarSign className="me-1" /> {formatSalary(job.salary)}</span>
            )}
            {job.createdAt && (
              <span className="d-flex align-items-center"><FiClock className="me-1" /> Posted {formatDistanceToNow(job.createdAt)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 flex-shrink-0 flex-wrap">
        {applyUrl && (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary d-flex align-items-center fw-medium"
          >
            <FiExternalLink className="me-2" /> Apply
          </a>
        )}

        {isLoggedIn && job.recruiter_id && job.recruiter_id !== user?._id && (
          <button
            onClick={handleSave}
            className={`btn d-flex align-items-center fw-medium ${
              isSaved
                ? 'btn-outline-primary active bg-primary bg-opacity-10'
                : 'btn-outline-secondary'
            }`}
          >
            {isSaved ? <FaBookmark className="me-2" /> : <FiBookmark className="me-2" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}

        {canEdit && (
          <button onClick={() => navigate(`/jobs/edit/${job._id}`)} className="btn btn-outline-primary d-flex align-items-center fw-medium">
            <FiEdit className="me-2" /> Edit
          </button>
        )}

        {canDelete && (
          <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-outline-danger d-flex align-items-center fw-medium">
            <FiTrash2 className="me-2" /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetailsHeader;
