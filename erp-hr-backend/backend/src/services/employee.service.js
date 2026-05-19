const bcrypt = require('bcryptjs');
const { Employee, User, Department, Position } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

async function listEmployees(query = {}) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const status = query.status || null;
  const where = {};
  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { nationalId: { [Op.iLike]: `%${search}%` } }
    ];
  }
  const { rows, count } = await Employee.findAndCountAll({
    where,
    include: [
      { model: Department, as: 'department' },
      { model: Position, as: 'position' },
      { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] }
    ],
    limit, offset, order: [['createdAt', 'DESC']]
  });
  return { items: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
}

async function getEmployeeById(id) {
  const employee = await Employee.findByPk(id, {
    include: [
      { model: Department, as: 'department' },
      { model: Position, as: 'position' },
      { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] },
      { model: User, as: 'user', attributes: ['id', 'email', 'role', 'isActive'] }
    ]
  });
  if (!employee) throw new AppError('Calisan bulunamadi', 404);
  return employee;
}

async function createEmployee(payload) {
  const existingNationalId = await Employee.findOne({ where: { nationalId: payload.nationalId } });
  if (existingNationalId) throw new AppError('Bu TC kimlik numarasi ile kayitli calisan bulunmaktadir', 409);
  const existingEmail = await User.findOne({ where: { email: payload.email } });
  if (existingEmail) throw new AppError('Bu e-posta ile kayitli kullanici bulunmaktadir', 409);

  const employee = await Employee.create({
    firstName: payload.firstName, lastName: payload.lastName, nationalId: payload.nationalId,
    email: payload.email, phone: payload.phone, dateOfBirth: payload.dateOfBirth,
    hireDate: payload.hireDate, departmentId: payload.departmentId, positionId: payload.positionId,
    managerId: payload.managerId || null, grossSalary: payload.grossSalary
  });

  const passwordHash = await bcrypt.hash(payload.password, 10);
  await User.create({ email: payload.email, passwordHash, role: payload.role, employeeId: employee.id });
  return getEmployeeById(employee.id);
}

async function updateEmployee(id, payload) {
  const employee = await Employee.findByPk(id, { include: [{ model: User, as: 'user' }] });
  if (!employee) throw new AppError('Calisan bulunamadi', 404);
  await employee.update(payload);
  if (payload.email && employee.user) await employee.user.update({ email: payload.email });
  return getEmployeeById(id);
}

async function updateEmployeeStatus(id, status) {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new AppError('Calisan bulunamadi', 404);
  await employee.update({ status });
  return employee;
}

module.exports = { listEmployees, getEmployeeById, createEmployee, updateEmployee, updateEmployeeStatus };
