import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiBookmark, FiEdit, FiTrash2, FiUsers, FiExternalLink } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

const formatSalary = (salary) => {
  if (salary?.min == null && salary?.max == null) return '—';
  const min = salary.min != null ? salary.min.toLocaleString() : '—';
  const max = salary.max != null ? salary.max.toLocaleString() : '—';
  return `${min} - ${max} ILS`;
};

const JobCard = ({ job, onSave, onEdit, onDelete }) => {
  const { user, isLoggedIn, isRecruiter, isAdmin } = useAuth();

  const isSaved = job.savedBy?.includes(user?._id);
  const canEdit = isAdmin || (isRecruiter && job.recruiter_id === user?._id);
  const canDelete = isAdmin || (isRecruiter && job.recruiter_id === user?._id);
  const jobId = job._id || job.id;
  const groupLabel = job.group && job.group !== '—' ? job.group : null;
  const locationLabel = job.location && job.location !== '—' ? job.location : groupLabel || '—';
  const typeLabel = job.jobType && job.jobType !== '—' ? job.jobType : (job.status || '—');
  const badgeLabel = job.experienceLevel && job.experienceLevel !== '—'
    ? job.experienceLevel
    : (groupLabel || job.approvalStatus || 'WhatsApp');

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) onSave(jobId);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(jobId);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(jobId);
  };

  const formattedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently';

  return (
    <Link to={`/jobs/${jobId}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm custom-card-hover border position-relative group">
        <div className="position-absolute top-0 end-0 p-3 d-flex gap-2 z-1">
          {isLoggedIn && job.recruiter_id && job.recruiter_id !== user?._id && (
            <button onClick={handleSaveClick} className="btn btn-light rounded-circle shadow-sm text-primary p-2 lh-1 action-btn">
              {isSaved ? <FaBookmark /> : <FiBookmark />}
            </button>
          )}
          {canEdit && (
            <button onClick={handleEditClick} className="btn btn-light rounded-circle shadow-sm text-info p-2 lh-1 action-btn">
              <FiEdit />
            </button>
          )}
          {canDelete && (
            <button onClick={handleDeleteClick} className="btn btn-light rounded-circle shadow-sm text-danger p-2 lh-1 action-btn">
              <FiTrash2 />
            </button>
          )}
        </div>

        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex align-items-start mb-3">
            <div className="flex-shrink-0 bg-light rounded d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '48px', height: '48px' }}>
              {job.image?.url ? (
                <img src={job.image.url} alt={job.image.alt || job.company} className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <FiBriefcase className="text-secondary fs-4" />
              )}
            </div>
            <div className="ms-3 flex-grow-1 pe-5">
              <h3 className="h6 fw-semibold text-body mb-1 text-truncate" title={job.title} dir="auto">{job.title}</h3>
              <p className="text-secondary fw-medium mb-0 small" dir="auto">{job.company || '—'}</p>
            </div>
          </div>

          <div className="d-flex flex-column gap-2 mb-4 flex-grow-1">
            <div className="d-flex align-items-center small text-secondary">
              {groupLabel && (!job.location || job.location === '—') ? (
                <FiUsers className="me-2 text-muted" />
              ) : (
                <FiMapPin className="me-2 text-muted" />
              )}
              <span dir="auto">{locationLabel}</span>
            </div>
            <div className="d-flex align-items-center small text-secondary">
              <FiBriefcase className="me-2 text-muted" />
              {typeLabel}
            </div>
            <div className="d-flex align-items-center small text-secondary">
              {job.applyUrl ? (
                <>
                  <FiExternalLink className="me-2 text-muted" />
                  Apply link available
                </>
              ) : (
                <>
                  <FiDollarSign className="me-2 text-muted" />
                  {formatSalary(job.salary)}
                </>
              )}
            </div>
          </div>

          <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
            <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill fw-medium text-truncate" style={{ maxWidth: '70%' }} dir="auto">
              {badgeLabel}
            </span>
            <span className="small text-muted d-flex align-items-center">
              <FiClock className="me-1" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
