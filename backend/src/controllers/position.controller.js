const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const { Position, Department } = require('../models');
const AppError = require('../utils/AppError');

const listPositions = catchAsync(async (req, res) => { return success(res, await Position.findAll({ include: [{ model: Department, as: 'department' }], order: [['title', 'ASC']] }), 'Pozisyon listesi getirildi'); });
const createPosition = catchAsync(async (req, res) => {
  const data = await Position.create(req.body);
  res.locals.audit = { action: 'CREATE', entityType: 'positions', entityId: data.id, newValues: req.body };
  return success(res, data, 'Pozisyon olusturuldu', 201);
});
const updatePosition = catchAsync(async (req, res) => {
  const pos = await Position.findByPk(req.params.id);
  if (!pos) throw new AppError('Pozisyon bulunamadi', 404);
  await pos.update(req.body);
  res.locals.audit = { action: 'UPDATE', entityType: 'positions', entityId: pos.id, newValues: req.body };
  return success(res, pos, 'Pozisyon guncellendi');
});

module.exports = { listPositions, createPosition, updatePosition };
