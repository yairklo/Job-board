import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title = 'No results found', message = 'Try adjusting your search or filter to find what you are looking for.', icon: Icon = FiInbox, action }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center bg-white rounded-3 border border-2 border-dashed border-secondary-subtle" data-bs-theme="light">
      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
        <Icon className="fs-3 text-secondary" />
      </div>
      <h3 className="h5 fw-medium text-body mb-2">{title}</h3>
      <p className="text-secondary mb-4" style={{ maxWidth: '400px' }}>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary fw-medium px-4"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
