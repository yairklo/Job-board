import React from 'react';

const JobCardSkeleton = () => {
  return (
    <div className="card h-100 shadow-sm border p-4 placeholder-glow">
      <div className="d-flex align-items-start mb-4">
        <div className="flex-shrink-0 bg-secondary bg-opacity-25 rounded placeholder" style={{ width: '48px', height: '48px' }}></div>
        <div className="ms-3 flex-grow-1">
          <div className="placeholder col-8 mb-2 rounded bg-secondary bg-opacity-25" style={{ height: '20px' }}></div>
          <div className="placeholder col-5 rounded bg-secondary bg-opacity-25" style={{ height: '16px' }}></div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3 mt-2 mb-4 flex-grow-1">
        <div className="placeholder col-10 rounded bg-secondary bg-opacity-25" style={{ height: '16px' }}></div>
        <div className="placeholder col-8 rounded bg-secondary bg-opacity-25" style={{ height: '16px' }}></div>
        <div className="placeholder col-9 rounded bg-secondary bg-opacity-25" style={{ height: '16px' }}></div>
      </div>

      <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
        <div className="placeholder col-3 rounded-pill bg-secondary bg-opacity-25" style={{ height: '24px' }}></div>
        <div className="placeholder col-2 rounded bg-secondary bg-opacity-25" style={{ height: '16px' }}></div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;
