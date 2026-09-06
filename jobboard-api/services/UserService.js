const bcrypt = require('bcrypt');
const User = require('../models/User');
const Job = require('../models/Job');
const createError = require('../helpers/createError');
const handleError = require('../helpers/handleError');
const { normalizeUser, sanitizeUser } = require('../helpers/normalizeUser');
const { signToken } = require('../helpers/jwt');

const SALT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_MS = 24 * 60 * 60 * 1000;

async function register(payload) {
  try {
    if (payload.isAdmin) {
      throw createError('AuthZ', 'Cannot set isAdmin during registration', 400);
    }

    const normalized = normalizeUser(payload);
    normalized.password = await bcrypt.hash(normalized.password, SALT_ROUNDS);
    normalized.isAdmin = false;

    const user = await User.create(normalized);
    return sanitizeUser(user);
  } catch (err) {
    throw handleError(err, 'Failed to register user');
  }
}

async function login({ email, password }) {
  try {
    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');

    if (!user) {
      throw createError('Auth', 'Invalid email or password.', 401);
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw createError('Auth', 'Account is locked. Try again after 24 hours.', 403);
    }

    if (user.lockUntil && user.lockUntil <= new Date()) {
      user.lockUntil = null;
      user.loginAttempts = 0;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_MS);
        user.loginAttempts = 0;
        await user.save();
        throw createError(
          'Auth',
          'Account locked for 24 hours due to too many failed login attempts.',
          403
        );
      }
      await user.save();
      throw createError('Auth', 'Invalid email or password.', 401);
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    return signToken(user);
  } catch (err) {
    throw handleError(err, 'Failed to login');
  }
}

async function getById(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw createError('NotFound', 'User not found', 404);
    }
    return sanitizeUser(user);
  } catch (err) {
    throw handleError(err, 'Failed to get user');
  }
}

async function updateProfile(id, payload) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw createError('NotFound', 'User not found', 404);
    }

    const normalized = normalizeUser({
      ...payload,
      email: user.email,
      isRecruiter: user.isRecruiter,
    });

    user.name = normalized.name;
    user.phone = normalized.phone;
    user.image = normalized.image;
    user.address = normalized.address;
    await user.save();

    return sanitizeUser(user);
  } catch (err) {
    throw handleError(err, 'Failed to update user');
  }
}

async function toggleRecruiter(id, isRecruiter) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw createError('NotFound', 'User not found', 404);
    }

    user.isRecruiter = typeof isRecruiter === 'boolean' ? isRecruiter : !user.isRecruiter;
    await user.save();

    return {
      user: sanitizeUser(user),
      token: signToken(user),
    };
  } catch (err) {
    throw handleError(err, 'Failed to update recruiter role');
  }
}

async function listUsers({ search = '', page = 1, limit = 10 } = {}) {
  try {
    const filter = {};
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { email: regex },
        { phone: regex },
        { 'name.first': regex },
        { 'name.last': regex },
        { 'name.middle': regex },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      docs: users.map(sanitizeUser),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (err) {
    throw handleError(err, 'Failed to list users');
  }
}

async function deleteUser(id, requester) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw createError('NotFound', 'User not found', 404);
    }

    if (user.isAdmin) {
      throw createError('AuthZ', 'Cannot delete an admin user', 403);
    }

    if (String(user._id) === String(requester._id)) {
      throw createError('AuthZ', 'Cannot delete your own account from this endpoint', 403);
    }

    await Job.deleteMany({ recruiterId: user._id });
    await user.deleteOne();
    return { deleted: true };
  } catch (err) {
    throw handleError(err, 'Failed to delete user');
  }
}

function assertUserAccess(requester, targetId) {
  const isOwner = String(requester._id) === String(targetId);
  if (!isOwner && !requester.isAdmin) {
    throw createError('AuthZ', 'Access denied.', 403);
  }
}

module.exports = {
  register,
  login,
  getById,
  updateProfile,
  toggleRecruiter,
  listUsers,
  deleteUser,
  assertUserAccess,
};
