import React from 'react';

export const InputField = ({ label, id, type = 'text', error, touched, ...props }) => (
  <div className="mb-3">
    <label className="form-label fw-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      className={`form-control ${touched && error ? 'is-invalid' : ''}`}
      {...props}
    />
    {touched && error && (
      <div className="invalid-feedback">{error}</div>
    )}
  </div>
);

export const SelectField = ({ label, id, options, error, touched, ...props }) => (
  <div className="mb-3">
    <label className="form-label fw-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <select
      id={id}
      className={`form-select ${touched && error ? 'is-invalid' : ''}`}
      {...props}
    >
      <option value="" disabled>Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {touched && error && (
      <div className="invalid-feedback">{error}</div>
    )}
  </div>
);
