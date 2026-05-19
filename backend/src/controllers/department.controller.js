const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const { Department } = require('../models');
const AppError = require('../utils/AppError');

const listDepartments = catchAsync(async (req, res) => { return success(res, await Department.findAll({ order: [['name', 'ASC']] }), 'Departman listesi getirildi'); });
const createDepartment = catchAsync(async (req, res) => {
  const data = await Department.create(req.body);
  res.locals.audit = { action: 'CREATE', entityType: 'departments', entityId: data.id, newValues: req.body };
  return success(res, data, 'Departman olusturuldu', 201);
});
const updateDepartment = catchAsync(async (req, res) => {
  const dept = await Department.findByPk(req.params.id);
  if (!dept) throw new AppError('Departman bulunamadi', 404);
  const oldValues = dept.toJSON();
  await dept.update(req.body);
  res.locals.audit = { action: 'UPDATE', entityType: 'departments', entityId: dept.id, oldValues, newValues: req.body };
  return success(res, dept, 'Departman guncellendi');
});
const deleteDepartment = catchAsync(async (req, res) => {
  const dept = await Department.findByPk(req.params.id);
  if (!dept) throw new AppError('Departman bulunamadi', 404);
  await dept.update({ isActive: false });
  res.locals.audit = { action: 'SOFT_DELETE', entityType: 'departments', entityId: dept.id };
  return success(res, dept, 'Departman pasife alindi');
});

module.exports = { listDepartments, createDepartment, updateDepartment, deleteDepartment };
