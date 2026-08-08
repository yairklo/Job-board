import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginSchema } from '../validation/userSchemas';
import { loginUser } from '../services/usersService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const token = await loginUser(values);
        login(token);
        toast.success('Login successful!');
        navigate('/');
      } catch (error) {
        let errorMessage = 'Invalid email or password';
        if (error.response?.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : (error.response.data.message || errorMessage);
        }
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: '480px' }}>
      <div className="card shadow-lg border-0 rounded-4 p-4 p-sm-5">
        <div className="text-center mb-5">
          <h2 className="fw-bolder text-body">Welcome back</h2>
          <p className="text-secondary small mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-4">
          <div>
            <label className="form-label fw-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="position-relative">
              <div className="position-absolute top-50 translate-middle-y ms-3 text-secondary">
                <FiMail />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ps-5 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback ps-1">{formik.errors.email}</div>
              )}
            </div>
          </div>

          <div>
            <label className="form-label fw-medium mb-1" htmlFor="password">
              Password
            </label>
            <div className="position-relative">
              <div className="position-absolute top-50 translate-middle-y ms-3 text-secondary">
                <FiLock />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-control ps-5 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback ps-1">{formik.errors.password}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100 py-2 fw-medium mt-3"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small text-secondary mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-decoration-none fw-medium text-primary custom-hover">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
