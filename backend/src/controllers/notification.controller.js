const notificationService = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const getNotifications = catchAsync(async (req, res) => {
  return success(res, await notificationService.getNotifications(req.user.id, req.query), 'Bildirimler');
});
const getUnreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  return success(res, { count }, 'Okunmamis bildirim sayisi');
});
const markAsRead = catchAsync(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  return success(res, null, 'Bildirim okundu');
});
const markAllAsRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  return success(res, null, 'Tum bildirimler okundu');
});

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead };