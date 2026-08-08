import { describe, it, expect } from 'vitest';
import { normalizeUser, normalizeJob } from './normalizers';

describe('normalizers', () => {
  describe('normalizeUser', () => {
    it('should normalize user data correctly with all fields', () => {
      const userData = {
        firstName: 'John',
        middleName: 'D',
        lastName: 'Doe',
        phone: '0501234567',
        email: 'john@example.com',
        password: 'Password1!',
        address: {
          state: 'NY',
          country: 'USA',
          city: 'New York',
          street: 'Broadway',
          houseNumber: '123',
          zip: '10001'
        },
        image: {
          url: 'http://example.com/image.jpg',
          alt: 'John image'
        },
        isRecruiter: true
      };

      const expected = {
        name: {
          first: 'John',
          middle: 'D',
          last: 'Doe',
        },
        phone: '0501234567',
        email: 'john@example.com',
        password: 'Password1!',
        address: {
          state: 'NY',
          country: 'USA',
          city: 'New York',
          street: 'Broadway',
          houseNumber: 123,
          zip: 10001,
        },
        image: {
          url: 'http://example.com/image.jpg',
          alt: 'John image',
        },
        isRecruiter: true,
      };

      expect(normalizeUser(userData)).toEqual(expected);
    });

    it('should handle missing optional fields', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '0501234567',
        email: 'john@example.com',
        password: 'Password1!',
      };

      const expected = {
        name: {
          first: 'John',
          middle: '',
          last: 'Doe',
        },
        phone: '0501234567',
        email: 'john@example.com',
        password: 'Password1!',
        address: {
          state: '',
          country: undefined,
          city: undefined,
          street: undefined,
          houseNumber: NaN,
          zip: 0,
        },
        image: {
          url: '',
          alt: '',
        },
        isRecruiter: false,
      };

      expect(normalizeUser(userData)).toEqual(expected);
    });
  });

  describe('normalizeJob', () => {
    it('should normalize job data correctly with all fields', () => {
      const jobData = {
        title: 'Developer',
        company: 'Tech Co',
        description: 'Great job',
        category: 'IT',
        location: 'Tel Aviv',
        jobType: 'Full-Time',
        experienceLevel: 'Junior',
        minSalary: '10000',
        maxSalary: '20000',
        phone: '0501234567',
        email: 'jobs@techco.com',
        image: {
          url: 'http://example.com/job.jpg',
          alt: 'Job image'
        },
        jobNumber: 12345
      };

      const expected = {
        title: 'Developer',
        company: 'Tech Co',
        description: 'Great job',
        category: 'IT',
        location: 'Tel Aviv',
        jobType: 'Full-Time',
        experienceLevel: 'Junior',
        salary: {
          min: 10000,
          max: 20000
        },
        phone: '0501234567',
        email: 'jobs@techco.com',
        image: {
          url: 'http://example.com/job.jpg',
          alt: 'Job image',
        },
        jobNumber: 12345
      };

      expect(normalizeJob(jobData)).toEqual(expected);
    });

    it('should handle missing optional fields for job', () => {
      const jobData = {
        title: 'Developer',
        company: 'Tech Co',
        description: 'Great job',
        category: 'IT',
        location: 'Tel Aviv',
        jobType: 'Full-Time',
        experienceLevel: 'Junior',
        minSalary: '10000',
        maxSalary: '20000',
        phone: '0501234567',
        email: 'jobs@techco.com',
      };

      const expected = {
        title: 'Developer',
        company: 'Tech Co',
        description: 'Great job',
        category: 'IT',
        location: 'Tel Aviv',
        jobType: 'Full-Time',
        experienceLevel: 'Junior',
        salary: {
          min: 10000,
          max: 20000
        },
        phone: '0501234567',
        email: 'jobs@techco.com',
        image: {
          url: '',
          alt: '',
        }
      };

      expect(normalizeJob(jobData)).toEqual(expected);
    });
  });
});
