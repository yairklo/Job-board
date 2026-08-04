import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { jobSchema } from '../validation/jobSchemas';
import { createJob, getJobById, updateJob } from '../services/jobsService';
import { normalizeJob } from '../utils/normalizers';
import { toast } from 'react-toastify';

import { InputField, SelectField } from '../components/FormFields';

const CreateEditJob = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(isEditMode);

  const formik = useFormik({
    initialValues: {
      title: '',
      company: '',
      description: '',
      category: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      minSalary: '',
      maxSalary: '',
      phone: '',
      email: '',
      applicationUrl: '',
      image: { url: '', alt: '' },
    },
    validationSchema: jobSchema,
    onSubmit: async (values) => {
      try {
        const normalizedData = normalizeJob(values);
        if (isEditMode) {
          await updateJob(id, normalizedData);
          toast.success('Job updated successfully');
        } else {
          await createJob(normalizedData);
          toast.success('Job created successfully');
        }
        navigate('/my-jobs');
      } catch (error) {
        toast.error(`Failed to ${isEditMode ? 'update' : 'create'} job. ${error.response?.data?.message || ''}`);
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const job = await getJobById(id);
          formik.setValues({
            title: job.title || '',
            company: job.company || '',
            description: job.description || '',
            category: job.category || '',
            location: job.location || '',
            jobType: job.jobType || '',
            experienceLevel: job.experienceLevel || '',
            minSalary: job.minSalary || '',
            maxSalary: job.maxSalary || '',
            phone: job.contact?.phone || job.phone || '',
            email: job.contact?.email || job.email || '',
            applicationUrl: job.contact?.applicationUrl || job.applicationUrl || '',
            image: {
              url: job.image?.url || '',
              alt: job.image?.alt || '',
            },
          });
        } catch (error) {
          toast.error('Failed to fetch job data');
          navigate('/my-jobs');
        } finally {
          setIsLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '900px' }}>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom p-4 p-md-5 pb-4">
          <h1 className="h3 fw-bold text-body mb-2">
            {isEditMode ? 'Edit Job Posting' : 'Create New Job'}
          </h1>
          <p className="text-secondary small mb-0">
            {isEditMode ? 'Update the details of your job listing.' : 'Fill out the form below to post a new opportunity.'}
          </p>
        </div>

        <div className="card-body p-4 p-md-5 pt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="d-flex flex-column gap-5">
              {/* Basic Info */}
              <section>
                <h3 className="h5 fw-bold text-body mb-4">Basic Information</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <InputField label="Job Title *" id="title" error={formik.errors.title} touched={formik.touched.title} {...formik.getFieldProps('title')} />
                  </div>
                  <div className="col-md-6">
                    <InputField label="Company Name *" id="company" error={formik.errors.company} touched={formik.touched.company} {...formik.getFieldProps('company')} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium mb-1" htmlFor="description">
                      Job Description *
                    </label>
                    <textarea
                      id="description"
                      rows="6"
                      className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('description')}
                    />
                    {formik.touched.description && formik.errors.description && (
                      <div className="invalid-feedback d-block mt-1">
                        {formik.errors.description}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Job Details */}
              <section className="border-top pt-4">
                <h3 className="h5 fw-bold text-body mb-4">Job Details</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <InputField label="Category *" id="category" error={formik.errors.category} touched={formik.touched.category} {...formik.getFieldProps('category')} />
                  </div>
                  <div className="col-md-6">
                    <InputField label="Location *" id="location" error={formik.errors.location} touched={formik.touched.location} {...formik.getFieldProps('location')} />
                  </div>
                  
                  <div className="col-md-6">
                    <SelectField 
                      label="Job Type *" 
                      id="jobType" 
                      options={['Full-Time', 'Part-Time', 'Freelance', 'Temporary', 'Internship']} 
                      error={formik.errors.jobType} touched={formik.touched.jobType}
                      {...formik.getFieldProps('jobType')} 
                    />
                  </div>
                  <div className="col-md-6">
                    <SelectField 
                      label="Experience Level *" 
                      id="experienceLevel" 
                      options={['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Team Lead', 'Management']} 
                      error={formik.errors.experienceLevel} touched={formik.touched.experienceLevel}
                      {...formik.getFieldProps('experienceLevel')} 
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <InputField label="Minimum Salary (ILS) *" id="minSalary" type="number" error={formik.errors.minSalary} touched={formik.touched.minSalary} {...formik.getFieldProps('minSalary')} />
                  </div>
                  <div className="col-md-6">
                    <InputField label="Maximum Salary (ILS) *" id="maxSalary" type="number" error={formik.errors.maxSalary} touched={formik.touched.maxSalary} {...formik.getFieldProps('maxSalary')} />
                  </div>
                </div>
              </section>

              {/* Contact & Image */}
              <section className="border-top pt-4">
                <h3 className="h5 fw-bold text-body mb-4">Contact & Media</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <InputField label="Contact Phone *" id="phone" error={formik.errors.phone} touched={formik.touched.phone} {...formik.getFieldProps('phone')} placeholder="0501234567" />
                  </div>
                  <div className="col-md-6">
                    <InputField label="Contact Email *" id="email" type="email" error={formik.errors.email} touched={formik.touched.email} {...formik.getFieldProps('email')} />
                  </div>
                  <div className="col-12">
                    <InputField label="Application URL (Optional)" id="applicationUrl" error={formik.errors.applicationUrl} touched={formik.touched.applicationUrl} {...formik.getFieldProps('applicationUrl')} />
                  </div>
                  
                  <div className="col-md-6">
                    <InputField label="Company Logo/Image URL" id="image.url" error={formik.errors?.image?.url} touched={formik.touched?.image?.url} {...formik.getFieldProps('image.url')} />
                  </div>
                  <div className="col-md-6">
                    <InputField label="Image Alt Text" id="image.alt" error={formik.errors?.image?.alt} touched={formik.touched?.image?.alt} {...formik.getFieldProps('image.alt')} />
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-5 pt-4 border-top d-flex justify-content-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline-secondary px-4 py-2 fw-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="btn btn-primary px-4 py-2 fw-medium"
              >
                {formik.isSubmitting ? 'Saving...' : (isEditMode ? 'Update Job' : 'Post Job')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditJob;
