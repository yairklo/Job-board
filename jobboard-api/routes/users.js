const express = require('express');
const usersController = require('../controllers/usersController');
const { auth } = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const validate = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  toggleRecruiterSchema,
  idParamSchema,
  usersQuerySchema,
} = require('../validations/users');

const router = express.Router();

router.post('/', validate(registerSchema), usersController.register);
router.post('/login', validate(loginSchema), usersController.login);

router.get('/', auth, requireAdmin, validate(usersQuerySchema, 'query'), usersController.getAll);
router.get('/:id', auth, validate(idParamSchema, 'params'), usersController.getById);
router.put('/:id', auth, validate(idParamSchema, 'params'), validate(updateProfileSchema), usersController.update);
router.patch('/:id', auth, validate(idParamSchema, 'params'), validate(toggleRecruiterSchema), usersController.toggleRecruiter);
router.delete('/:id', auth, requireAdmin, validate(idParamSchema, 'params'), usersController.remove);

module.exports = router;
