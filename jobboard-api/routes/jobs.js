const express = require('express');
const jobsController = require('../controllers/jobsController');
const { auth } = require('../middlewares/auth');
const requireRecruiter = require('../middlewares/requireRecruiter');
const validate = require('../middlewares/validate');
const { jobBodySchema, idParamSchema, jobsQuerySchema } = require('../validations/jobs');

const router = express.Router();

router.get('/', validate(jobsQuerySchema, 'query'), jobsController.getAll);
router.get('/my-jobs', auth, requireRecruiter, jobsController.getMyJobs);
router.get('/:id', validate(idParamSchema, 'params'), jobsController.getById);
router.post('/', auth, requireRecruiter, validate(jobBodySchema), jobsController.create);
router.put('/:id', auth, validate(idParamSchema, 'params'), validate(jobBodySchema), jobsController.update);
router.delete('/:id', auth, validate(idParamSchema, 'params'), jobsController.remove);
router.patch('/:id', auth, validate(idParamSchema, 'params'), jobsController.toggleSaved);

module.exports = router;
