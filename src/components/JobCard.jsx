import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiBookmark, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { formatDistanceToNow } from '../utils/date-utils';

const JobCard = ({ job, onSave, onEdit, onDelete }) => {
  const { user, isLoggedIn, isRecruiter, isAdmin } = useAuth();
  
  const isSaved = job.savedBy?.includes(user?._id);
  const canEdit = isAdmin || (isRecruiter && job.recruiter_id === user?._id);
  const canDelete = isAdmin || (isRecruiter && job.recruiter_id === user?._id);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) onSave(job._id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(job._id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(job._id);
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString();
  const timeAgo = job.createdAt ? `${formattedDate}` : 'Recently'; // Simulating time ago for simplicity without external lib if needed

  return (
    <Link to={`/jobs/${job._id}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm custom-card-hover border position-relative group">
        
        {/* Action Buttons - We'll use a custom CSS class for the hover opacity if needed, or just show them on mobile. Let's make them visible but subtle */}
        <div className="position-absolute top-0 end-0 p-3 d-flex gap-2 z-1">
          {isLoggedIn && !isRecruiter && !isAdmin && (
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
              <h3 className="h6 fw-semibold text-body mb-1 text-truncate" title={job.title}>{job.title}</h3>
              <p className="text-secondary fw-medium mb-0 small">{job.company}</p>
            </div>
          </div>

          <div className="d-flex flex-column gap-2 mb-4 flex-grow-1">
            <div className="d-flex align-items-center small text-secondary">
              <FiMapPin className="me-2 text-muted" />
              {job.location}
            </div>
            <div className="d-flex align-items-center small text-secondary">
              <FiBriefcase className="me-2 text-muted" />
              {job.jobType}
            </div>
            <div className="d-flex align-items-center small text-secondary">
              <FiDollarSign className="me-2 text-muted" />
              {job.minSalary != null ? job.minSalary.toLocaleString() : 'N/A'} - {job.maxSalary != null ? job.maxSalary.toLocaleString() : 'N/A'} ILS
            </div>
          </div>

          <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
            <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill fw-medium">
              {job.experienceLevel}
            </span>
            <span className="small text-muted d-flex align-items-center">
              <FiClock className="me-1" />
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
