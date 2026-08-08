import { describe, it, expect } from 'vitest';
import { jobSchema } from './jobSchemas';

describe('jobSchema', () => {
  const validJob = {
    title: 'Software Engineer',
    company: 'Tech Corp',
    description: 'We are looking for a software engineer.',
    category: 'Software',
    location: 'Tel Aviv',
    jobType: 'Full-Time',
    experienceLevel: 'Mid-Level',
    minSalary: 10000,
    maxSalary: 20000,
    phone: '0501234567',
    email: 'hr@techcorp.com',
    image: {
      url: 'https://example.com/logo.png',
      alt: 'Company Logo'
    }
  };

  it('should validate a correct job payload', async () => {
    await expect(jobSchema.validate(validJob)).resolves.toEqual(validJob);
  });

  it('should fail if required fields are missing', async () => {
    const invalidJob = { ...validJob, title: undefined };
    await expect(jobSchema.validate(invalidJob)).rejects.toThrow('Title is required');
  });

  it('should fail if maxSalary is less than minSalary', async () => {
    const invalidJob = { ...validJob, minSalary: 20000, maxSalary: 10000 };
    await expect(jobSchema.validate(invalidJob)).rejects.toThrow('Max salary must be greater than or equal to Min salary');
  });

  it('should fail on invalid phone format', async () => {
    const invalidJob = { ...validJob, phone: '12345' };
    await expect(jobSchema.validate(invalidJob)).rejects.toThrow('Phone must be a valid Israeli format');
  });

  it('should fail on invalid email format', async () => {
    const invalidJob = { ...validJob, email: 'not-an-email' };
    await expect(jobSchema.validate(invalidJob)).rejects.toThrow('Invalid email address');
  });

  it('should fail on invalid jobType', async () => {
    const invalidJob = { ...validJob, jobType: 'Invalid-Type' };
    await expect(jobSchema.validate(invalidJob)).rejects.toThrow('jobType must be one of the following values: Full-Time, Part-Time, Freelance, Temporary, Internship');
  });

  it('should allow image without url and alt', async () => {
    const validJobNoImage = { ...validJob };
    delete validJobNoImage.image.url;
    delete validJobNoImage.image.alt;
    await expect(jobSchema.validate(validJobNoImage)).resolves.toBeTruthy();
  });

  it('should require image alt if image url is provided', async () => {
    const invalidJob = { ...validJob, image: { url: 'https://example.com/img.jpg', alt: undefined } };
    await expect(jobSchema.validate(invalidJob)).rejects.toThrow('Alt text is required if URL is provided');
  });
});
