const express = require('express');
const controller = require('../controllers/reports.controller');
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');
const router = express.Router();
router.use(auth);
router.get('/leave-summary', allowRoles('ADMIN', 'HR_MANAGER'), controller.getLeaveReport);
router.get('/leave-summary/export', allowRoles('ADMIN', 'HR_MANAGER'), controller.exportLeaveReport);
module.exports = router;
