import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputField, SelectField } from './FormFields';

describe('FormFields', () => {
  describe('InputField', () => {
    it('renders label and input', () => {
      render(<InputField label="Username" id="username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('shows error when touched and error exists', () => {
      render(<InputField label="Username" id="username" touched={true} error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveClass('is-invalid');
    });

    it('calls onChange handler', () => {
      const handleChange = vi.fn();
      render(<InputField label="Username" id="username" onChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('SelectField', () => {
    const options = ['Option 1', 'Option 2'];

    it('renders label and select with options', () => {
      render(<SelectField label="Role" id="role" options={options} />);
      expect(screen.getByLabelText('Role')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('shows error when touched and error exists', () => {
      render(<SelectField label="Role" id="role" options={options} touched={true} error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveClass('is-invalid');
    });

    it('calls onChange handler', () => {
      const handleChange = vi.fn();
      render(<SelectField label="Role" id="role" options={options} onChange={handleChange} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Option 1' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
