import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { registerSchema } from '../validation/userSchemas';
import { registerUser } from '../services/usersService';
import { normalizeUser } from '../utils/normalizers';
import { toast } from 'react-toastify';

import { InputField } from '../components/FormFields';

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      email: '',
      password: '',
      image: { url: '', alt: '' },
      address: {
        state: '',
        country: '',
        city: '',
        street: '',
        houseNumber: '',
        zip: '',
      },
      isRecruiter: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const normalizedData = normalizeUser(values);
        await registerUser(normalizedData);
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: '800px' }}>
      <div className="card shadow-lg border-0 rounded-4 p-4 p-sm-5">
        <div className="text-center mb-5">
          <h2 className="fw-bolder text-body">Create an account</h2>
          <p className="text-secondary small mt-2">Join WebifyJobs today</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <InputField label="First Name *" id="firstName" error={formik.errors.firstName} touched={formik.touched.firstName} {...formik.getFieldProps('firstName')} />
            </div>
            <div className="col-md-6">
              <InputField label="Last Name *" id="lastName" error={formik.errors.lastName} touched={formik.touched.lastName} {...formik.getFieldProps('lastName')} />
            </div>
            <div className="col-md-6">
              <InputField label="Middle Name" id="middleName" error={formik.errors.middleName} touched={formik.touched.middleName} {...formik.getFieldProps('middleName')} />
            </div>
            <div className="col-md-6">
              <InputField label="Phone *" id="phone" error={formik.errors.phone} touched={formik.touched.phone} {...formik.getFieldProps('phone')} placeholder="0501234567" />
            </div>
            
            <div className="col-12">
              <InputField label="Email Address *" id="email" type="email" error={formik.errors.email} touched={formik.touched.email} {...formik.getFieldProps('email')} />
            </div>
            <div className="col-12">
              <InputField label="Password *" id="password" type="password" error={formik.errors.password} touched={formik.touched.password} {...formik.getFieldProps('password')} />
            </div>
          </div>

          <h3 className="h5 fw-medium text-body mt-5 mb-4 border-bottom pb-2">Address</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <InputField label="Country *" id="address.country" error={formik.errors?.address?.country} touched={formik.touched?.address?.country} {...formik.getFieldProps('address.country')} />
            </div>
            <div className="col-md-6">
              <InputField label="City *" id="address.city" error={formik.errors?.address?.city} touched={formik.touched?.address?.city} {...formik.getFieldProps('address.city')} />
            </div>
            <div className="col-md-6">
              <InputField label="Street *" id="address.street" error={formik.errors?.address?.street} touched={formik.touched?.address?.street} {...formik.getFieldProps('address.street')} />
            </div>
            <div className="col-md-6">
              <InputField label="House Number *" id="address.houseNumber" type="number" error={formik.errors?.address?.houseNumber} touched={formik.touched?.address?.houseNumber} {...formik.getFieldProps('address.houseNumber')} />
            </div>
            <div className="col-md-6">
              <InputField label="State" id="address.state" error={formik.errors?.address?.state} touched={formik.touched?.address?.state} {...formik.getFieldProps('address.state')} />
            </div>
            <div className="col-md-6">
              <InputField label="ZIP Code" id="address.zip" type="number" error={formik.errors?.address?.zip} touched={formik.touched?.address?.zip} {...formik.getFieldProps('address.zip')} />
            </div>
          </div>

          <h3 className="h5 fw-medium text-body mt-5 mb-4 border-bottom pb-2">Profile Image</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <InputField label="Image URL" id="image.url" error={formik.errors?.image?.url} touched={formik.touched?.image?.url} {...formik.getFieldProps('image.url')} />
            </div>
            <div className="col-md-6">
              <InputField label="Image Alt Text" id="image.alt" error={formik.errors?.image?.alt} touched={formik.touched?.image?.alt} {...formik.getFieldProps('image.alt')} />
            </div>
          </div>

          <div className="form-check mt-4 mb-5">
            <input
              id="isRecruiter"
              name="isRecruiter"
              type="checkbox"
              className="form-check-input"
              onChange={formik.handleChange}
              checked={formik.values.isRecruiter}
            />
            <label htmlFor="isRecruiter" className="form-check-label text-body cursor-pointer ms-2">
              I am a Recruiter looking to post jobs
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100 py-3 fw-medium"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small text-secondary mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none fw-medium text-primary custom-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
