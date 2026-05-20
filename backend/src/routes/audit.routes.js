const express = require('express');
const controller = require('../controllers/audit.controller');
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');
const router = express.Router();
router.use(auth);
router.get('/', allowRoles('ADMIN', 'HR_MANAGER'), controller.listAuditLogs);
router.get('/:id', allowRoles('ADMIN', 'HR_MANAGER'), controller.getAuditLogById);
module.exports = router;