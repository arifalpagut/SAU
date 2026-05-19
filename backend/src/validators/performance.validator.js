const Joi = require('joi');

const createPeriodSchema = Joi.object({
  name: Joi.string().max(100).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'CLOSED').required()
});
const updatePeriodSchema = Joi.object({
  name: Joi.string().max(100),
  startDate: Joi.date(),
  endDate: Joi.date(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'CLOSED')
});
const createGoalSchema = Joi.object({
  employeeId: Joi.string().uuid().required(),
  periodId: Joi.string().uuid().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow('', null),
  weight: Joi.number().min(0).max(100).required()
});
const updateGoalSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().allow('', null),
  weight: Joi.number().min(0).max(100)
});
const selfScoreSchema = Joi.object({ selfScore: Joi.number().min(1).max(5).required() });
const managerScoreSchema = Joi.object({ managerScore: Joi.number().min(1).max(5).required() });

module.exports = { createPeriodSchema, updatePeriodSchema, createGoalSchema, updateGoalSchema, selfScoreSchema, managerScoreSchema };
