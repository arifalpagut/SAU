const leaveService = require('../services/leave.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const { LeaveType } = require('../models');

const listLeaves = catchAsync(async (req, res) => { return success(res, await leaveService.listLeaves(req.user, req.query), 'Izin listesi getirildi'); });
const createLeave = catchAsync(async (req, res) => {
  const data = await leaveService.createLeaveRequest(req.user, req.body);
  res.locals.audit = { action: 'CREATE', entityType: 'leaves', entityId: data.id, newValues: req.body };
  return success(res, data, 'Izin talebi olusturuldu', 201);
});
const approveLeave = catchAsync(async (req, res) => {
  const data = await leaveService.approveLeave(req.user, req.params.id);
  res.locals.audit = { action: 'APPROVE', entityType: 'leaves', entityId: data.id };
  return success(res, data, 'Izin talebi onaylandi');
});
const rejectLeave = catchAsync(async (req, res) => {
  const data = await leaveService.rejectLeave(req.user, req.params.id, req.body.rejectionReason);
  res.locals.audit = { action: 'REJECT', entityType: 'leaves', entityId: data.id };
  return success(res, data, 'Izin talebi reddedildi');
});
const cancelLeave = catchAsync(async (req, res) => {
  const data = await leaveService.cancelLeave(req.user, req.params.id);
  res.locals.audit = { action: 'CANCEL', entityType: 'leaves', entityId: data.id };
  return success(res, data, 'Izin talebi iptal edildi');
});
const listLeaveTypes = catchAsync(async (req, res) => { return success(res, await LeaveType.findAll({ order: [['name', 'ASC']] }), 'Izin turleri getirildi'); });
const createLeaveType = catchAsync(async (req, res) => {
  const data = await LeaveType.create(req.body);
  res.locals.audit = { action: 'CREATE', entityType: 'leave_types', entityId: data.id, newValues: req.body };
  return success(res, data, 'Izin turu olusturuldu', 201);
});
const getLeaveBalance = catchAsync(async (req, res) => { return success(res, await leaveService.getLeaveBalance(req.user, req.params.employeeId), 'Izin bakiyesi getirildi'); });
const getLeaveCalendar = catchAsync(async (req, res) => { return success(res, await leaveService.getLeaveCalendar(), 'Izin takvimi getirildi'); });

module.exports = { listLeaves, createLeave, approveLeave, rejectLeave, cancelLeave, listLeaveTypes, createLeaveType, getLeaveBalance, getLeaveCalendar };
