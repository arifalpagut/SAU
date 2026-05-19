const employeeService = require('../services/employee.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const listEmployees = catchAsync(async (req, res) => { return success(res, await employeeService.listEmployees(req.query), 'Calisan listesi getirildi'); });
const getEmployeeById = catchAsync(async (req, res) => { return success(res, await employeeService.getEmployeeById(req.params.id), 'Calisan detayi getirildi'); });
const createEmployee = catchAsync(async (req, res) => {
  const data = await employeeService.createEmployee(req.body);
  res.locals.audit = { action: 'CREATE', entityType: 'employees', entityId: data.id, newValues: req.body };
  return success(res, data, 'Calisan olusturuldu', 201);
});
const updateEmployee = catchAsync(async (req, res) => {
  const data = await employeeService.updateEmployee(req.params.id, req.body);
  res.locals.audit = { action: 'UPDATE', entityType: 'employees', entityId: data.id, newValues: req.body };
  return success(res, data, 'Calisan guncellendi');
});
const updateEmployeeStatus = catchAsync(async (req, res) => {
  const data = await employeeService.updateEmployeeStatus(req.params.id, req.body.status);
  res.locals.audit = { action: 'UPDATE_STATUS', entityType: 'employees', entityId: data.id, newValues: { status: req.body.status } };
  return success(res, data, 'Calisan durumu guncellendi');
});

module.exports = { listEmployees, getEmployeeById, createEmployee, updateEmployee, updateEmployeeStatus };
