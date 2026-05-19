const Joi = require('joi');

const createLeaveSchema = Joi.object({
  leaveTypeId: Joi.string().uuid().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  reason: Joi.string().allow('', null)
});
const approveLeaveSchema = Joi.object({});
const rejectLeaveSchema = Joi.object({ rejectionReason: Joi.string().required() });

module.exports = { createLeaveSchema, approveLeaveSchema, rejectLeaveSchema };
