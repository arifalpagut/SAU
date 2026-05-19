const { AuditLog } = require('../models');

module.exports = function auditMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = async function patchedJson(body) {
    try {
      if (req.user && res.locals.audit) {
        await AuditLog.create({
          userId: req.user.id,
          action: res.locals.audit.action,
          entityType: res.locals.audit.entityType,
          entityId: res.locals.audit.entityId || null,
          oldValues: res.locals.audit.oldValues || null,
          newValues: res.locals.audit.newValues || null,
          ipAddress: req.ip
        });
      }
    } catch (e) { req.log?.error?.(e); }
    return originalJson(body);
  };
  next();
};
