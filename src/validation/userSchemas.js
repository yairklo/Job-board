import * as Yup from 'yup';

const phoneRegex = /^0\d{8,10}$/; // Basic Israeli phone validation (9-11 digits starting with 0)

export const registerSchema = Yup.object({
  firstName: Yup.string().required('First name is required').min(2).max(256),
  lastName: Yup.string().required('Last name is required').min(2).max(256),
  middleName: Yup.string().max(256),
  phone: Yup.string().required('Phone is required').matches(phoneRegex, 'Phone must be a valid Israeli format'),
  email: Yup.string().required('Email is required').email('Invalid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/, 'Password must contain at least 1 lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
    .matches(/(?=.*\d.*\d.*\d.*\d)/, 'Password must contain at least 4 digits')
    .matches(/(?=.*[!@#$%^&*-])/, 'Password must contain at least 1 special character (!@#$%^&*-)'),
  image: Yup.object({
    url: Yup.string().url('Must be a valid URL'),
    alt: Yup.string().when('url', {
      is: (url) => url && url.length > 0,
      then: () => Yup.string().required('Alt text is required if URL is provided'),
      otherwise: () => Yup.string()
    })
  }),
  address: Yup.object({
    state: Yup.string(),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    street: Yup.string().required('Street is required'),
    houseNumber: Yup.number().required('House number is required').min(1),
    zip: Yup.number()
  }),
  isRecruiter: Yup.boolean()
});

export const loginSchema = Yup.object({
  email: Yup.string().required('Email is required').email('Invalid email address'),
  password: Yup.string().required('Password is required')
});
