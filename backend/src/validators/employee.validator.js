const Joi = require('joi');

const createEmployeeSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  nationalId: Joi.string().length(11).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).allow('', null),
  dateOfBirth: Joi.date().required(),
  hireDate: Joi.date().required(),
  departmentId: Joi.string().uuid().required(),
  positionId: Joi.string().uuid().required(),
  managerId: Joi.string().uuid().allow(null, ''),
  grossSalary: Joi.number().precision(2).required(),
  role: Joi.string().valid('ADMIN', 'HR_MANAGER', 'EMPLOYEE', 'FINANCE', 'MANAGER').required(),
  password: Joi.string().min(6).required()
});

const updateEmployeeSchema = Joi.object({
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100),
  nationalId: Joi.string().length(11),
  email: Joi.string().email(),
  phone: Joi.string().max(20).allow('', null),
  dateOfBirth: Joi.date(),
  hireDate: Joi.date(),
  terminationDate: Joi.date().allow(null),
  departmentId: Joi.string().uuid(),
  positionId: Joi.string().uuid(),
  managerId: Joi.string().uuid().allow(null, ''),
  grossSalary: Joi.number().precision(2),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE')
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE').required()
});

module.exports = { createEmployeeSchema, updateEmployeeSchema, updateStatusSchema };
