import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{title}</h5>
          </div>
          <div className="modal-body py-3">
            <p className="text-secondary mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 bg-light rounded-bottom-4">
            <button
              onClick={onCancel}
              className="btn btn-outline-secondary fw-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="btn btn-danger fw-medium"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
