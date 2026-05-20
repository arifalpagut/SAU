const { Announcement, User, Employee } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

const listAnnouncements = catchAsync(async (req, res) => {
  const where = {};
  if (req.query.active === 'true') {
    where.isActive = true;
    where[Op.or] = [{ expiresAt: null }, { expiresAt: { [Op.gte]: new Date() } }];
  }
  const anns = await Announcement.findAll({ where, order: [['publishedAt', 'DESC']] });
  return success(res, anns, 'Duyurular');
});

const getActiveAnnouncements = catchAsync(async (req, res) => {
  const role = req.user.role;
  const anns = await Announcement.findAll({
    where: { isActive: true, [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gte]: new Date() } }] },
    order: [['priority', 'DESC'], ['publishedAt', 'DESC']]
  });
  const filtered = anns.filter(a => {
    if (!a.targetRoles || a.targetRoles === '') return true;
    return a.targetRoles.split(',').map(r => r.trim()).includes(role);
  });
  return success(res, filtered, 'Aktif duyurular');
});

const createAnnouncement = catchAsync(async (req, res) => {
  const data = await Announcement.create({ ...req.body, publishedBy: req.user.id });
  res.locals.audit = { action: 'CREATE', entityType: 'announcements', entityId: data.id };
  return success(res, data, 'Duyuru olusturuldu', 201);
});

const updateAnnouncement = catchAsync(async (req, res) => {
  const ann = await Announcement.findByPk(req.params.id);
  if (!ann) throw new AppError('Duyuru bulunamadi', 404);
  await ann.update(req.body);
  return success(res, ann, 'Duyuru guncellendi');
});

const deleteAnnouncement = catchAsync(async (req, res) => {
  const ann = await Announcement.findByPk(req.params.id);
  if (!ann) throw new AppError('Duyuru bulunamadi', 404);
  await ann.update({ isActive: false });
  return success(res, null, 'Duyuru pasife alindi');
});

module.exports = { listAnnouncements, getActiveAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };