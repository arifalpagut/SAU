const { Notification, User, Employee } = require('../models');
const { Op } = require('sequelize');

async function createNotification({ userId, title, message, type, module: mod, entityType, entityId }) {
  return Notification.create({ userId, title, message: message || '', type: type || 'INFO', module: mod || '', entityType: entityType || '', entityId: entityId || null });
}

async function notifyUser(userId, title, message, opts) {
  opts = opts || {};
  return createNotification({ userId, title, message, type: opts.type || 'INFO', module: opts.module || '', entityType: opts.entityType || '', entityId: opts.entityId || null });
}

async function notifyByRole(role, title, message, opts) {
  opts = opts || {};
  const users = await User.findAll({ where: { role, isActive: true } });
  for (const u of users) { await notifyUser(u.id, title, message, opts); }
}

async function getNotifications(userId, query) {
  query = query || {};
  const where = { userId };
  if (query.isRead === 'true') where.isRead = true;
  if (query.isRead === 'false') where.isRead = false;
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const { rows, count } = await Notification.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit });
  return { items: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
}

async function getUnreadCount(userId) {
  return Notification.count({ where: { userId, isRead: false } });
}

async function markAsRead(id, userId) {
  const n = await Notification.findOne({ where: { id, userId } });
  if (n) await n.update({ isRead: true, readAt: new Date() });
  return n;
}

async function markAllAsRead(userId) {
  await Notification.update({ isRead: true, readAt: new Date() }, { where: { userId, isRead: false } });
  return true;
}

module.exports = { createNotification, notifyUser, notifyByRole, getNotifications, getUnreadCount, markAsRead, markAllAsRead };