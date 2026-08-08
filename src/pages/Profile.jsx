import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, toggleRecruiterRole } from '../services/usersService';
import { normalizeUser } from '../utils/normalizers';
import { toast } from 'react-toastify';
import { FiUser, FiSettings } from 'react-icons/fi';
import bcrypt from 'bcryptjs';

import { updateProfileSchema } from '../validation/userSchemas';
import { InputField } from '../components/FormFields';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingRole, setIsTogglingRole] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      email: '', // Disabled
      password: '', // Required to prevent overwriting with something else
      address: {
        state: '',
        country: '',
        city: '',
        street: '',
        houseNumber: '',
        zip: '',
      },
      image: { url: '', alt: '' },
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      try {
        const normalizedData = normalizeUser(values);

        let hashedPassword = '';
        let isValidHash = false;
        while (!isValidHash) {
          hashedPassword = bcrypt.hashSync(values.password, 10);
          if (/(?=.*[A-Z])/.test(hashedPassword) && /(?=.*[a-z])/.test(hashedPassword) && /(?=.*\d)/.test(hashedPassword)) {
            isValidHash = true;
          }
        }
        normalizedData.password = hashedPassword;

        // The backend requires isRecruiter to be sent. We must send the user's current status so they don't get demoted!
        normalizedData.isRecruiter = user?.isRecruiter || false;
        
        await updateUserProfile(user._id, normalizedData);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error(`Failed to update profile: ${error.response?.data?.message || error.response?.data || error.message}`);
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await getUserProfile(user._id);
        
        formik.setValues({
          firstName: profileData.name?.first || '',
          lastName: profileData.name?.last || '',
          middleName: profileData.name?.middle || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          password: '', // Prevent uncontrolled input warning
          address: {
            state: profileData.address?.state || '',
            country: profileData.address?.country || '',
            city: profileData.address?.city || '',
            street: profileData.address?.street || '',
            houseNumber: profileData.address?.houseNumber || '',
            zip: profileData.address?.zip || '',
          },
          image: {
            url: profileData.image?.url || '',
            alt: profileData.image?.alt || '',
          }
        });
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const handleRoleToggle = async () => {
    try {
      setIsTogglingRole(true);
      await toggleRecruiterRole(user._id, !user.isRecruiter);
      toast.success('Role updated. Please log in again to apply changes.');
      setTimeout(() => logout(), 2000);
    } catch (error) {
      toast.error('Failed to update role');
      setIsTogglingRole(false);
    }
  };

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="mb-5">
        <h1 className="display-6 fw-bold text-body d-flex align-items-center">
          <FiUser className="me-3 text-primary" />
          My Profile
        </h1>
        <p className="text-secondary mt-2">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4 d-flex flex-column gap-4">
          {/* Avatar Card */}
          <div className="card shadow-sm border-0 rounded-4 text-center p-4">
            <div className="mx-auto rounded-circle bg-light overflow-hidden mb-4 border border-4 border-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: '128px', height: '128px' }}>
              {formik.values.image?.url ? (
                <img src={formik.values.image.url} alt="Profile" className="w-100 h-100 object-fit-cover" />
              ) : (
                <FiUser className="text-secondary" size={48} />
              )}
            </div>
            <h2 className="h5 fw-bold text-body">{formik.values.firstName} {formik.values.lastName}</h2>
            <p className="text-secondary small mb-3">{formik.values.email}</p>
            <div>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-medium">
                {user?.isAdmin ? 'Admin' : user?.isRecruiter ? 'Recruiter' : 'Job Seeker'}
              </span>
            </div>
          </div>

          {/* Account Settings */}
          {!user?.isAdmin && (
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <h3 className="h6 fw-bold text-body mb-3 d-flex align-items-center">
                <FiSettings className="me-2 text-secondary" /> Account Settings
              </h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small fw-medium text-body">Recruiter Account</span>
                  <div className="form-check form-switch fs-5 mb-0">
                    <input 
                      className="form-check-input cursor-pointer" 
                      type="checkbox" 
                      role="switch" 
                      id="flexSwitchCheckDefault"
                      checked={user?.isRecruiter || false}
                      onChange={handleRoleToggle}
                      disabled={isTogglingRole}
                    />
                  </div>
                </div>
                <p className="small text-secondary mb-0" style={{ fontSize: '0.8rem' }}>
                  Toggle to switch between job seeker and recruiter capabilities. Changing this will require you to log in again.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <form onSubmit={formik.handleSubmit}>
              <h3 className="h5 fw-medium text-body mb-4 border-bottom pb-2">Personal Information</h3>
              <div className="row g-3">
                <div className="col-sm-6">
                  <InputField label="First Name" id="firstName" error={formik.errors.firstName} touched={formik.touched.firstName} {...formik.getFieldProps('firstName')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="Last Name" id="lastName" error={formik.errors.lastName} touched={formik.touched.lastName} {...formik.getFieldProps('lastName')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="Middle Name" id="middleName" error={formik.errors.middleName} touched={formik.touched.middleName} {...formik.getFieldProps('middleName')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="Phone Number" id="phone" error={formik.errors.phone} touched={formik.touched.phone} {...formik.getFieldProps('phone')} />
                </div>
                <div className="col-12">
                  <InputField label="Email Address (Cannot be changed)" id="email" type="email" disabled {...formik.getFieldProps('email')} />
                </div>
                <div className="col-12">
                  <InputField label="Confirm Password (Required to save changes)" id="password" type="password" error={formik.errors.password} touched={formik.touched.password} {...formik.getFieldProps('password')} />
                  <div className="form-text text-muted small">
                    For security reasons, please enter your current password to update your profile (or a new password to change it).
                  </div>
                </div>
              </div>

              <h3 className="h5 fw-medium text-body mt-5 mb-4 border-bottom pb-2">Address</h3>
              <div className="row g-3">
                <div className="col-sm-6">
                  <InputField label="Country" id="address.country" error={formik.errors?.address?.country} touched={formik.touched?.address?.country} {...formik.getFieldProps('address.country')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="City" id="address.city" error={formik.errors?.address?.city} touched={formik.touched?.address?.city} {...formik.getFieldProps('address.city')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="Street" id="address.street" error={formik.errors?.address?.street} touched={formik.touched?.address?.street} {...formik.getFieldProps('address.street')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="House Number" id="address.houseNumber" type="number" error={formik.errors?.address?.houseNumber} touched={formik.touched?.address?.houseNumber} {...formik.getFieldProps('address.houseNumber')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="State" id="address.state" error={formik.errors?.address?.state} touched={formik.touched?.address?.state} {...formik.getFieldProps('address.state')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="ZIP Code" id="address.zip" type="number" error={formik.errors?.address?.zip} touched={formik.touched?.address?.zip} {...formik.getFieldProps('address.zip')} />
                </div>
              </div>

              <h3 className="h5 fw-medium text-body mt-5 mb-4 border-bottom pb-2">Profile Image</h3>
              <div className="row g-3">
                <div className="col-sm-6">
                  <InputField label="Image URL" id="image.url" error={formik.errors?.image?.url} touched={formik.touched?.image?.url} {...formik.getFieldProps('image.url')} />
                </div>
                <div className="col-sm-6">
                  <InputField label="Image Alt Text" id="image.alt" error={formik.errors?.image?.alt} touched={formik.touched?.image?.alt} {...formik.getFieldProps('image.alt')} />
                </div>
              </div>

              <div className="mt-5 d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="btn btn-primary px-4 py-2 fw-medium"
                >
                  {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
