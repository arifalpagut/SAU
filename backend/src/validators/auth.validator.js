const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required()
});
const refreshSchema = Joi.object({ refreshToken: Joi.string().required() });
const logoutSchema = Joi.object({ refreshToken: Joi.string().required() });
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = { loginSchema, refreshSchema, logoutSchema, changePasswordSchema };
