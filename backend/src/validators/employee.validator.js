const Joi = require('joi');

const createEmployeeSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  nationalId: Joi.string().length(11).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.string().max(20).allow('', null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').allow('', null),
  dateOfBirth: Joi.date().required(),
  address: Joi.string().allow('', null),
  iban: Joi.string().max(34).allow('', null),
  photo: Joi.string().allow('', null),
  hireDate: Joi.date().required(),
  departmentId: Joi.string().uuid().required(),
  positionId: Joi.string().uuid().required(),
  managerId: Joi.string().uuid().allow(null, ''),
  grossSalary: Joi.number().precision(2).required(),
  workType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'INTERN', 'CONTRACT').default('FULL_TIME'),
  workLocation: Joi.string().valid('OFFICE', 'REMOTE', 'HYBRID').default('OFFICE'),
  emergencyContactName: Joi.string().max(100).allow('', null),
  emergencyContactPhone: Joi.string().max(20).allow('', null),
  role: Joi.string().valid('ADMIN', 'HR_MANAGER', 'EMPLOYEE', 'FINANCE', 'MANAGER').required(),
  password: Joi.string().min(6).required()
});

const updateEmployeeSchema = Joi.object({
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100),
  nationalId: Joi.string().length(11),
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.string().max(20).allow('', null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').allow('', null),
  dateOfBirth: Joi.date(),
  address: Joi.string().allow('', null),
  iban: Joi.string().max(34).allow('', null),
  photo: Joi.string().allow('', null),
  hireDate: Joi.date(),
  terminationDate: Joi.date().allow(null),
  departmentId: Joi.string().uuid(),
  positionId: Joi.string().uuid(),
  managerId: Joi.string().uuid().allow(null, ''),
  grossSalary: Joi.number().precision(2),
  workType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'INTERN', 'CONTRACT'),
  workLocation: Joi.string().valid('OFFICE', 'REMOTE', 'HYBRID'),
  emergencyContactName: Joi.string().max(100).allow('', null),
  emergencyContactPhone: Joi.string().max(20).allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE')
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE').required()
});

module.exports = { createEmployeeSchema, updateEmployeeSchema, updateStatusSchema };