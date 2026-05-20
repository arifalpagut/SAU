const { AuditLog, User, Employee } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const { Op } = require('sequelize');

const listAuditLogs = catchAsync(async (req, res) => {
  const where = {};
  if (req.query.userId) where.userId = req.query.userId;
  if (req.query.entityType) where.entityType = req.query.entityType;
  if (req.query.action) where.action = { [Op.iLike]: '%' + req.query.action + '%' };
  if (req.query.moduleName) where.moduleName = req.query.moduleName;
  if (req.query.startDate && req.query.endDate) {
    where.createdAt = { [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate + 'T23:59:59')] };
  }
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const offset = (page - 1) * limit;
  const { rows, count } = await AuditLog.findAndCountAll({
    where, include: [{ model: User, as: 'user', attributes: ['id', 'email', 'role'], include: [{ model: Employee, as: 'employee', attributes: ['firstName', 'lastName'] }] }],
    order: [['createdAt', 'DESC']], limit, offset
  });
  return success(res, { items: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } }, 'Audit loglari');
});

const getAuditLogById = catchAsync(async (req, res) => {
  const log = await AuditLog.findByPk(req.params.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'email', 'role'] }]
  });
  if (!log) return res.status(404).json({ success: false, message: 'Log bulunamadi' });
  return success(res, log, 'Audit log detayi');
});

module.exports = { listAuditLogs, getAuditLogById };