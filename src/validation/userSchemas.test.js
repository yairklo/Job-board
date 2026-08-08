import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, updateProfileSchema } from './userSchemas';

describe('userSchemas', () => {
  const validRegisterUser = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '0501234567',
    email: 'john@example.com',
    password: 'Password1!',
    address: {
      country: 'Israel',
      city: 'Tel Aviv',
      street: 'Dizengoff',
      houseNumber: 10,
    }
  };

  describe('registerSchema', () => {
    it('should validate a correct register payload', async () => {
      await expect(registerSchema.validate(validRegisterUser)).resolves.toBeDefined();
    });

    it('should fail on missing required fields', async () => {
      const invalidUser = { ...validRegisterUser, email: undefined };
      await expect(registerSchema.validate(invalidUser)).rejects.toThrow('Email is required');
    });

    it('should fail on weak password', async () => {
      const invalidUser = { ...validRegisterUser, password: 'password' };
      await expect(registerSchema.validate(invalidUser)).rejects.toThrow('Password must contain at least 1 uppercase letter');
    });

    it('should fail on short password (6 chars)', async () => {
      const invalidUser = { ...validRegisterUser, password: 'Aa1!a' }; // 5 chars + 1 spec = 6
      await expect(registerSchema.validate(invalidUser)).rejects.toThrow('Password must be at least 7 characters');
    });

    it('should pass on valid password (7 chars)', async () => {
      const validUser = { ...validRegisterUser, password: 'Aa1!ab2' };
      await expect(registerSchema.validate(validUser)).resolves.toBeDefined();
    });

    it('should fail on invalid phone', async () => {
      const invalidUser = { ...validRegisterUser, phone: '05' };
      await expect(registerSchema.validate(invalidUser)).rejects.toThrow('Phone must be a valid Israeli format');
    });

    it('should fail on short address fields', async () => {
      const invalidCountry = { ...validRegisterUser, address: { ...validRegisterUser.address, country: 'I' } };
      await expect(registerSchema.validate(invalidCountry)).rejects.toThrow();

      const invalidCity = { ...validRegisterUser, address: { ...validRegisterUser.address, city: 'T' } };
      await expect(registerSchema.validate(invalidCity)).rejects.toThrow();

      const invalidStreet = { ...validRegisterUser, address: { ...validRegisterUser.address, street: 'D' } };
      await expect(registerSchema.validate(invalidStreet)).rejects.toThrow();
    });

    it('should fail on house number less than 1', async () => {
      const invalidHouse = { ...validRegisterUser, address: { ...validRegisterUser.address, houseNumber: 0 } };
      await expect(registerSchema.validate(invalidHouse)).rejects.toThrow('houseNumber must be greater than or equal to 1');
    });
  });

  describe('loginSchema', () => {
    it('should validate a correct login payload', async () => {
      const validLogin = { email: 'john@example.com', password: 'Password1!' };
      await expect(loginSchema.validate(validLogin)).resolves.toEqual(validLogin);
    });

    it('should fail if email is missing', async () => {
      const invalidLogin = { password: 'Password1!' };
      await expect(loginSchema.validate(invalidLogin)).rejects.toThrow('Email is required');
    });
  });

  describe('updateProfileSchema', () => {
    it('should validate a correct update profile payload', async () => {
      await expect(updateProfileSchema.validate(validRegisterUser)).resolves.toBeDefined();
    });

    it('should fail if first name is missing', async () => {
      const invalidUser = { ...validRegisterUser, firstName: undefined };
      await expect(updateProfileSchema.validate(invalidUser)).rejects.toThrow('First name is required');
    });
  });
});
