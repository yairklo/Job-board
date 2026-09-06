import React from 'react';
import { DATE_ADDED_OPTIONS } from '../utils/date-utils';

const DateAddedFilter = ({ value, onChange }) => (
  <select
    className="form-select form-select-lg border-0 shadow-sm"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    aria-label="Filter by date added"
  >
    {DATE_ADDED_OPTIONS.map((option) => (
      <option key={option.value || 'any'} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default DateAddedFilter;
