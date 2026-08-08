import * as Yup from 'yup';

const phoneRegex = /^0\d{8,10}$/;

export const jobSchema = Yup.object({
  title: Yup.string().required('Title is required').min(2).max(256),
  company: Yup.string().required('Company is required').min(2).max(256),
  description: Yup.string().required('Description is required').min(2).max(1024),
  category: Yup.string().required('Category is required').min(2).max(256),
  location: Yup.string().required('Location is required').min(2).max(256),
  jobType: Yup.string().required('Job type is required').oneOf(['Full-Time', 'Part-Time', 'Freelance', 'Temporary', 'Internship']),
  experienceLevel: Yup.string().required('Experience level is required').oneOf(['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Team Lead', 'Management']),
  minSalary: Yup.number().required('Min salary is required').min(0),
  maxSalary: Yup.number().required('Max salary is required').min(0).when('minSalary', (minSalary, schema) => {
    return schema.min(minSalary, 'Max salary must be greater than or equal to Min salary');
  }),
  phone: Yup.string().required('Phone is required').matches(phoneRegex, 'Phone must be a valid Israeli format'),
  email: Yup.string().required('Email is required').email('Invalid email address'),
  image: Yup.object({
    url: Yup.string().url('Must be a valid URL'),
    alt: Yup.string().when('url', {
      is: (url) => url && url.length > 0,
      then: () => Yup.string().required('Alt text is required if URL is provided'),
      otherwise: () => Yup.string()
    })
  })
});
