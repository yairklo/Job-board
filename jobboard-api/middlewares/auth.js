const { verifyToken } = require('../helpers/jwt');
const createError = require('../helpers/createError');

function getTokenFromRequest(req) {
  const headerToken = req.header('x-auth-token');
  if (headerToken) {
    return headerToken;
  }

  const authorization = req.header('Authorization') || '';
  if (authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.slice(7).trim();
  }

  return null;
}

function auth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw createError('Auth', 'Access denied. No token provided.', 401);
    }

    const decoded = verifyToken(token);
    req.user = {
      _id: String(decoded._id),
      isRecruiter: Boolean(decoded.isRecruiter),
      isAdmin: Boolean(decoded.isAdmin),
    };
    next();
  } catch (err) {
    if (err.status) {
      return next(err);
    }
    next(createError('Auth', 'Invalid or expired token.', 401));
  }
}

function optionalAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return next();
    }
    const decoded = verifyToken(token);
    req.user = {
      _id: String(decoded._id),
      isRecruiter: Boolean(decoded.isRecruiter),
      isAdmin: Boolean(decoded.isAdmin),
    };
    next();
  } catch (_err) {
    next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return next(createError('Auth', 'Access denied.', 401));
  }
  next();
}

module.exports = { auth, optionalAuth, requireAuth };
