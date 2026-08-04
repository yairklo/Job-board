import React from 'react';
import { FiGlobe, FiPhone, FiMail } from 'react-icons/fi';

const JobDetailsSidebar = ({ job }) => {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="bg-light p-4 rounded-4 border">
        <h3 className="h6 fw-bold text-body mb-3">Job Overview</h3>
        <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
          <li>
            <div className="small text-secondary mb-1">Category</div>
            <div className="fw-medium text-body">{job.category}</div>
          </li>
          <li>
            <div className="small text-secondary mb-1">Experience Level</div>
            <div className="fw-medium text-body">{job.experienceLevel}</div>
          </li>
          <li>
            <div className="small text-secondary mb-1">Job Number</div>
            <div className="fw-medium text-body">{job.jobNumber}</div>
          </li>
        </ul>
      </div>

      <div className="bg-primary bg-opacity-10 p-4 rounded-4 border border-primary border-opacity-25">
        <h3 className="h6 fw-bold text-primary mb-3">Contact Information</h3>
        <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
          <li className="d-flex align-items-center text-body">
            <FiMail className="me-3 text-primary" />
            <a href={`mailto:${job.email}`} className="text-decoration-none text-body custom-hover text-truncate">{job.email}</a>
          </li>
          <li className="d-flex align-items-center text-body">
            <FiPhone className="me-3 text-primary" />
            <a href={`tel:${job.phone}`} className="text-decoration-none text-body custom-hover">{job.phone}</a>
          </li>
          {job.applicationUrl && (
            <li className="d-flex align-items-center text-body">
              <FiGlobe className="me-3 text-primary" />
              <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-body custom-hover text-truncate">Apply Here</a>
            </li>
          )}
        </ul>
      </div>
      
      {job.applicationUrl && (
        <a 
          href={job.applicationUrl} 
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
