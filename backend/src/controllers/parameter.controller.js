const { PayrollParameter, LeaveType } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const listPayrollParams = catchAsync(async (req, res) => {
  const params = await PayrollParameter.findAll({ order: [['year', 'DESC'], ['parameterName', 'ASC']] });
  return success(res, params, 'Bordro parametreleri');
});
const updatePayrollParam = catchAsync(async (req, res) => {
  const p = await PayrollParameter.findByPk(req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Parametre bulunamadi' });
  await p.update(req.body);
  return success(res, p, 'Parametre guncellendi');
});
const listLeaveTypes = catchAsync(async (req, res) => {
  const types = await LeaveType.findAll({ order: [['name', 'ASC']] });
  return success(res, types, 'Izin turleri');
});
const updateLeaveType = catchAsync(async (req, res) => {
  const t = await LeaveType.findByPk(req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Izin turu bulunamadi' });
  await t.update(req.body);
  return success(res, t, 'Izin turu guncellendi');
});
const createLeaveType = catchAsync(async (req, res) => {
  const t = await LeaveType.create(req.body);
  return success(res, t, 'Izin turu olusturuldu', 201);
});

module.exports = { listPayrollParams, updatePayrollParam, listLeaveTypes, updateLeaveType, createLeaveType };