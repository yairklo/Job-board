import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-3 py-3 border-top d-flex align-items-center justify-content-between">
      <div className="d-none d-sm-flex flex-fill align-items-center justify-content-between">
        <div>
          <p className="mb-0 text-secondary small">
            Showing page <span className="fw-medium">{currentPage}</span> of <span className="fw-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
