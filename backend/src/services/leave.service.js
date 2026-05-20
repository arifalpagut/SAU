const {
  Leave, LeaveType, LeaveBalance, Employee, Department, Position
} = require('../models');
const AppError = require('../utils/AppError');
const { calculateLeaveDays, calculateAnnualLeaveEntitlement } = require('../utils/leaveCalculator');
const { LEAVE_STATUS, ROLES } = require('../utils/constants');
const { Op } = require('sequelize');

async function ensureBalance(employeeId, leaveTypeId, year) {
  let balance = await LeaveBalance.findOne({
    where: { employeeId, leaveTypeId, year }
  });

  if (!balance) {
    const leaveType = await LeaveType.findByPk(leaveTypeId);
    if (!leaveType) throw new AppError('Izin turu bulunamadi', 404);

    let totalDays = leaveType.defaultDays;

    // Yillik izin ise kidem bazli hesapla
    if (leaveType.name === 'Yillik Izin' || leaveType.name === 'Yıllık İzin') {
      const employee = await Employee.findByPk(employeeId);
      if (employee) {
        const entitlement = calculateAnnualLeaveEntitlement(employee.hireDate, employee.dateOfBirth);
        totalDays = entitlement.days;
      }
    }

    balance = await LeaveBalance.create({
      employeeId, leaveTypeId, year,
      totalDays,
      usedDays: 0,
      remainingDays: totalDays
    });
  }

  return balance;
}

async function getEmployeeLeaveInfo(employeeId) {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new AppError('Calisan bulunamadi', 404);

  const entitlement = calculateAnnualLeaveEntitlement(employee.hireDate, employee.dateOfBirth);
  const year = new Date().getFullYear();

  // Tum izin turleri icin bakiye olustur/getir
  const leaveTypes = await LeaveType.findAll();
  const balances = [];

  for (const lt of leaveTypes) {
    let totalDays = lt.defaultDays;

    if (lt.name === 'Yillik Izin' || lt.name === 'Yıllık İzin') {
      totalDays = entitlement.days;
    }

    let balance = await LeaveBalance.findOne({
      where: { employeeId, leaveTypeId: lt.id, year }
    });

    if (!balance) {
      balance = await LeaveBalance.create({
        employeeId, leaveTypeId: lt.id, year,
        totalDays,
        usedDays: 0,
        remainingDays: totalDays
      });
    }

    balances.push({
      id: balance.id,
      leaveType: lt.name,
      totalDays: Number(balance.totalDays),
      usedDays: Number(balance.usedDays),
      remainingDays: Number(balance.remainingDays),
      year: balance.year
    });
  }

  return {
    entitlement,
    balances
  };
}

async function createLeaveRequest(currentUser, payload) {
  const employeeId = currentUser.employeeId;
  const totalDays = calculateLeaveDays(payload.startDate, payload.endDate);
  const year = new Date(payload.startDate).getFullYear();
  const balance = await ensureBalance(employeeId, payload.leaveTypeId, year);
  if (Number(balance.remainingDays) < totalDays) throw new AppError('Yetersiz izin bakiyesi', 400);
  return Leave.create({ employeeId, leaveTypeId: payload.leaveTypeId, startDate: payload.startDate, endDate: payload.endDate, totalDays, reason: payload.reason, status: LEAVE_STATUS.PENDING });
}

async function listLeaves(currentUser, query = {}) {
  const where = {};
  if (query.status) where.status = query.status;
  if (currentUser.role === ROLES.EMPLOYEE) where.employeeId = currentUser.employeeId;
  if (currentUser.role === ROLES.MANAGER) {
    const teamMembers = await Employee.findAll({ where: { managerId: currentUser.employeeId }, attributes: ['id'] });
    const teamIds = teamMembers.map((e) => e.id);
    where.employeeId = { [Op.in]: teamIds.length ? teamIds : ['00000000-0000-0000-0000-000000000000'] };
  }
  return Leave.findAll({
    where,
    include: [
      { model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }, { model: Position, as: 'position' }] },
      { model: LeaveType, as: 'leaveType' }
    ],
    order: [['createdAt', 'DESC']]
  });
}

async function approveLeave(currentUser, leaveId) {
  const leave = await Leave.findByPk(leaveId, { include: [{ model: Employee, as: 'employee' }] });
  if (!leave) throw new AppError('Izin kaydi bulunamadi', 404);
  if (leave.status !== LEAVE_STATUS.PENDING) throw new AppError('Sadece bekleyen talepler onaylanabilir', 400);
  if (currentUser.role === ROLES.MANAGER && leave.employee.managerId !== currentUser.employeeId) throw new AppError('Sadece kendi ekibinizin izinlerini onaylayabilirsiniz', 403);
  const year = new Date(leave.startDate).getFullYear();
  const balance = await ensureBalance(leave.employeeId, leave.leaveTypeId, year);
  if (Number(balance.remainingDays) < Number(leave.totalDays)) throw new AppError('Yetersiz izin bakiyesi', 400);
  await balance.update({ usedDays: Number(balance.usedDays) + Number(leave.totalDays), remainingDays: Number(balance.remainingDays) - Number(leave.totalDays) });
  await leave.update({ status: LEAVE_STATUS.APPROVED, approvedBy: currentUser.id, approvedAt: new Date() });
  return leave;
}

async function rejectLeave(currentUser, leaveId, rejectionReason) {
  const leave = await Leave.findByPk(leaveId, { include: [{ model: Employee, as: 'employee' }] });
  if (!leave) throw new AppError('Izin kaydi bulunamadi', 404);
  if (leave.status !== LEAVE_STATUS.PENDING) throw new AppError('Sadece bekleyen talepler reddedilebilir', 400);
  if (currentUser.role === ROLES.MANAGER && leave.employee.managerId !== currentUser.employeeId) throw new AppError('Sadece kendi ekibinizin izinlerini reddedebilirsiniz', 403);
  await leave.update({ status: LEAVE_STATUS.REJECTED, approvedBy: currentUser.id, approvedAt: new Date(), rejectionReason });
  return leave;
}

async function cancelLeave(currentUser, leaveId) {
  const leave = await Leave.findByPk(leaveId);
  if (!leave) throw new AppError('Izin kaydi bulunamadi', 404);
  const isOwner = leave.employeeId === currentUser.employeeId;
  const isPrivileged = [ROLES.ADMIN, ROLES.HR_MANAGER].includes(currentUser.role);
  if (!isOwner && !isPrivileged) throw new AppError('Bu kaydi iptal etmeye yetkiniz yok', 403);
  if (leave.status === LEAVE_STATUS.APPROVED) {
    const year = new Date(leave.startDate).getFullYear();
    const balance = await ensureBalance(leave.employeeId, leave.leaveTypeId, year);
    await balance.update({ usedDays: Math.max(0, Number(balance.usedDays) - Number(leave.totalDays)), remainingDays: Number(balance.remainingDays) + Number(leave.totalDays) });
  }
  await leave.update({ status: LEAVE_STATUS.CANCELLED });
  return leave;
}

async function getLeaveBalance(currentUser, employeeId) {
  const targetEmployeeId = employeeId || currentUser.employeeId;
  if (currentUser.role === ROLES.EMPLOYEE && targetEmployeeId !== currentUser.employeeId) throw new AppError('Sadece kendi izin bakiyenizi goruntuleyebilirsiniz', 403);
  return LeaveBalance.findAll({ where: { employeeId: targetEmployeeId }, include: [{ model: LeaveType, as: 'leaveType' }] });
}

async function getLeaveCalendar() {
  return Leave.findAll({
    where: { status: { [Op.in]: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] } },
    include: [
      { model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] },
      { model: LeaveType, as: 'leaveType' }
    ],
    order: [['startDate', 'ASC']]
  });
}

module.exports = { createLeaveRequest, listLeaves, approveLeave, rejectLeave, cancelLeave, getLeaveBalance, getLeaveCalendar, getEmployeeLeaveInfo };
