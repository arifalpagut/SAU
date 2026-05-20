const employeeService = require('../services/employee.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const listEmployees = catchAsync(async (req, res) => { return success(res, await employeeService.listEmployees(req.query), 'Calisan listesi'); });
const getEmployeeById = catchAsync(async (req, res) => { return success(res, await employeeService.getEmployeeById(req.params.id), 'Calisan detayi'); });
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
const getProfileSummary = catchAsync(async (req, res) => { return success(res, await employeeService.getProfileSummary(req.params.id), 'Profil ozeti'); });
const getLeaveHistory = catchAsync(async (req, res) => { return success(res, await employeeService.getLeaveHistory(req.params.id), 'Izin gecmisi'); });
const getPayrollHistory = catchAsync(async (req, res) => { return success(res, await employeeService.getPayrollHistory(req.params.id), 'Bordro gecmisi'); });
const getPerformanceHistory = catchAsync(async (req, res) => { return success(res, await employeeService.getPerformanceHistory(req.params.id), 'Performans gecmisi'); });

module.exports = { listEmployees, getEmployeeById, createEmployee, updateEmployee, updateEmployeeStatus, getProfileSummary, getLeaveHistory, getPayrollHistory, getPerformanceHistory };