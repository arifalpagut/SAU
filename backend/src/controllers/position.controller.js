const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const { Position, Department, Employee } = require('../models');
const AppError = require('../utils/AppError');

const listPositions = catchAsync(async (req, res) => {
  const positions = await Position.findAll({
    include: [{ model: Department, as: 'department' }],
    order: [['title', 'ASC']]
  });
  const result = [];
  for (const pos of positions) {
    const empCount = await Employee.count({ where: { positionId: pos.id } });
    const p = pos.toJSON();
    p.employeeCount = empCount;
    result.push(p);
  }
  return success(res, result, 'Pozisyon listesi getirildi');
});

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