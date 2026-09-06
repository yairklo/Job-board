const UserService = require('../services/UserService');

async function register(req, res, next) {
  try {
    const user = await UserService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const token = await UserService.login(req.body);
    // React login() expects the raw JWT string (axios data === token).
    res.status(200).send(token);
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const result = await UserService.listUsers(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    UserService.assertUserAccess(req.user, req.params.id);
    const user = await UserService.getById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    UserService.assertUserAccess(req.user, req.params.id);
    const user = await UserService.updateProfile(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function toggleRecruiter(req, res, next) {
  try {
    UserService.assertUserAccess(req.user, req.params.id);
    const result = await UserService.toggleRecruiter(req.params.id, req.body.isRecruiter);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await UserService.deleteUser(req.params.id, req.user);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getAll,
  getById,
  update,
  toggleRecruiter,
  remove,
};
