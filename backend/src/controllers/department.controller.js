const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const { Department, Employee, Position } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

const listDepartments = catchAsync(async (req, res) => {
  const departments = await Department.findAll({
    order: [['name', 'ASC']],
    include: [
      { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] }
    ]
  });
  const result = [];
  for (const dept of departments) {
    const employeeCount = await Employee.count({ where: { departmentId: dept.id } });
    const d = dept.toJSON();
    d.employeeCount = employeeCount;
    result.push(d);
  }
  return success(res, result, 'Departman listesi getirildi');
});

const createDepartment = catchAsync(async (req, res) => {
  const existing = await Department.findOne({ where: { name: req.body.name } });
  if (existing) throw new AppError('Bu isimde departman zaten var', 409);
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
  const empCount = await Employee.count({ where: { departmentId: dept.id, status: 'ACTIVE' } });
  if (empCount > 0) throw new AppError('Aktif calisani olan departman pasife alinamaz. Once calisanlari tasiyin.', 400);
  await dept.update({ isActive: false });
  res.locals.audit = { action: 'SOFT_DELETE', entityType: 'departments', entityId: dept.id };
  return success(res, dept, 'Departman pasife alindi');
});

const getDepartmentEmployees = catchAsync(async (req, res) => {
  const dept = await Department.findByPk(req.params.id);
  if (!dept) throw new AppError('Departman bulunamadi', 404);
  const employees = await Employee.findAll({
    where: { departmentId: req.params.id },
    include: [{ model: Position, as: 'position' }],
    order: [['firstName', 'ASC']]
  });
  return success(res, { department: dept, employees }, 'Departman calisanlari getirildi');
});

module.exports = { listDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentEmployees };