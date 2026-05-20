const bcrypt = require('bcryptjs');
const { Employee, User, Department, Position, EmployeeHistory, Leave, LeaveType, Payroll, Evaluation, EvaluationPeriod } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

async function generateEmployeeNo() {
  const last = await Employee.findOne({ where: { employeeNo: { [Op.not]: null } }, order: [['employeeNo', 'DESC']] });
  if (!last || !last.employeeNo) return 'EMP-0001';
  const num = parseInt(last.employeeNo.replace('EMP-', ''), 10);
  return 'EMP-' + String(num + 1).padStart(4, '0');
}

async function listEmployees(query) {
  query = query || {};
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const offset = (page - 1) * limit;
  const where = {};
  if (query.status) where.status = query.status;
  if (query.departmentId) where.departmentId = query.departmentId;
  if (query.workType) where.workType = query.workType;
  if (query.search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: '%' + query.search + '%' } },
      { lastName: { [Op.iLike]: '%' + query.search + '%' } },
      { email: { [Op.iLike]: '%' + query.search + '%' } },
      { nationalId: { [Op.iLike]: '%' + query.search + '%' } },
      { employeeNo: { [Op.iLike]: '%' + query.search + '%' } }
    ];
  }
  const { rows, count } = await Employee.findAndCountAll({
    where, include: [
      { model: Department, as: 'department' },
      { model: Position, as: 'position' },
      { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] }
    ], limit, offset, order: [['createdAt', 'DESC']]
  });
  return { items: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
}

async function getEmployeeById(id) {
  const emp = await Employee.findByPk(id, {
    include: [
      { model: Department, as: 'department' },
      { model: Position, as: 'position' },
      { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] },
      { model: User, as: 'user', attributes: ['id', 'email', 'role', 'isActive'] }
    ]
  });
  if (!emp) throw new AppError('Calisan bulunamadi', 404);
  return emp;
}

async function createEmployee(payload) {
  const existingNId = await Employee.findOne({ where: { nationalId: payload.nationalId } });
  if (existingNId) throw new AppError('Bu TC kimlik ile kayitli calisan var', 409);
  const existingEmail = await User.findOne({ where: { email: payload.email } });
  if (existingEmail) throw new AppError('Bu e-posta ile kayitli kullanici var', 409);
  const employeeNo = await generateEmployeeNo();
  const emp = await Employee.create({
    employeeNo, firstName: payload.firstName, lastName: payload.lastName,
    nationalId: payload.nationalId, email: payload.email, phone: payload.phone,
    gender: payload.gender, dateOfBirth: payload.dateOfBirth, address: payload.address,
    iban: payload.iban, hireDate: payload.hireDate,
    departmentId: payload.departmentId, positionId: payload.positionId,
    managerId: payload.managerId || null, grossSalary: payload.grossSalary,
    workType: payload.workType || 'FULL_TIME', workLocation: payload.workLocation || 'OFFICE',
    emergencyContactName: payload.emergencyContactName, emergencyContactPhone: payload.emergencyContactPhone
  });
  const hash = await bcrypt.hash(payload.password, 10);
  await User.create({ email: payload.email, passwordHash: hash, role: payload.role, employeeId: emp.id });
  return getEmployeeById(emp.id);
}

async function logChanges(empId, oldData, newData, userId) {
  const fields = ['firstName','lastName','departmentId','positionId','managerId','grossSalary','status','workType','workLocation'];
  const typeMap = { departmentId: 'DEPARTMENT', positionId: 'POSITION', managerId: 'MANAGER', grossSalary: 'SALARY', status: 'STATUS', workType: 'WORK_TYPE', workLocation: 'LOCATION' };
  for (const f of fields) {
    if (newData[f] !== undefined && String(newData[f]) !== String(oldData[f])) {
      await EmployeeHistory.create({ employeeId: empId, changeType: typeMap[f] || 'UPDATE', fieldName: f, oldValue: String(oldData[f] || ''), newValue: String(newData[f] || ''), changedBy: userId });
    }
  }
}

async function updateEmployee(id, payload, userId) {
  const emp = await Employee.findByPk(id, { include: [{ model: User, as: 'user' }] });
  if (!emp) throw new AppError('Calisan bulunamadi', 404);
  const oldData = emp.toJSON();
  await emp.update(payload);
  if (userId) await logChanges(id, oldData, payload, userId);
  if (payload.email && emp.user) await emp.user.update({ email: payload.email });
  return getEmployeeById(id);
}

async function updateEmployeeStatus(id, status) {
  const emp = await Employee.findByPk(id);
  if (!emp) throw new AppError('Calisan bulunamadi', 404);
  const data = { status };
  if (status === 'TERMINATED') data.terminationDate = new Date().toISOString().split('T')[0];
  await emp.update(data);
  return emp;
}

async function getProfileSummary(id) {
  const emp = await getEmployeeById(id);
  const leaveCount = await Leave.count({ where: { employeeId: id } });
  const payrollCount = await Payroll.count({ where: { employeeId: id } });
  const evalCount = await Evaluation.count({ where: { employeeId: id } });
  const lastPayroll = await Payroll.findOne({ where: { employeeId: id }, order: [['periodYear', 'DESC'], ['periodMonth', 'DESC']] });
  const lastEval = await Evaluation.findOne({ where: { employeeId: id }, order: [['createdAt', 'DESC']] });
  return { employee: emp, stats: { leaveCount, payrollCount, evalCount }, lastPayroll, lastEval };
}

async function getLeaveHistory(id) {
  return Leave.findAll({ where: { employeeId: id }, include: [{ model: LeaveType, as: 'leaveType' }], order: [['createdAt', 'DESC']] });
}

async function getPayrollHistory(id) {
  return Payroll.findAll({ where: { employeeId: id }, order: [['periodYear', 'DESC'], ['periodMonth', 'DESC']] });
}

async function getPerformanceHistory(id) {
  return Evaluation.findAll({ where: { employeeId: id }, include: [{ model: EvaluationPeriod, as: 'period' }], order: [['createdAt', 'DESC']] });
}

module.exports = { listEmployees, getEmployeeById, createEmployee, updateEmployee, updateEmployeeStatus, getProfileSummary, getLeaveHistory, getPayrollHistory, getPerformanceHistory };