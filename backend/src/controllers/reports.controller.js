const { Employee, Department, Position, LeaveBalance, LeaveType } = require('../models');
const { calculateAnnualLeaveEntitlement } = require('../utils/leaveCalculator');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const { Op } = require('sequelize');

const getLeaveReport = catchAsync(async (req, res) => {
  const where = { status: 'ACTIVE' };
  if (req.query.departmentId) where.departmentId = req.query.departmentId;
  if (req.query.search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: '%' + req.query.search + '%' } },
      { lastName: { [Op.iLike]: '%' + req.query.search + '%' } },
      { employeeNo: { [Op.iLike]: '%' + req.query.search + '%' } }
    ];
  }
  const employees = await Employee.findAll({ where, include: [{ model: Department, as: 'department' }, { model: Position, as: 'position' }], order: [['firstName', 'ASC']] });
  const leaveTypes = await LeaveType.findAll();
  const year = Number(req.query.year) || new Date().getFullYear();
  const result = [];
  let totalEntitled = 0, totalUsed = 0, totalRemaining = 0;

  for (const emp of employees) {
    const ent = calculateAnnualLeaveEntitlement(emp.hireDate, emp.dateOfBirth);
    let empUsed = 0;
    for (const lt of leaveTypes) {
      const bal = await LeaveBalance.findOne({ where: { employeeId: emp.id, leaveTypeId: lt.id, year } });
      if (bal) empUsed += Number(bal.usedDays);
    }
    totalEntitled += ent.days;
    totalUsed += empUsed;
    totalRemaining += (ent.days - empUsed);
    result.push({
      id: emp.id, employeeNo: emp.employeeNo, firstName: emp.firstName, lastName: emp.lastName,
      department: emp.department ? emp.department.name : '-', position: emp.position ? emp.position.title : '-',
      hireDate: emp.hireDate, seniority: ent.seniority, age: ent.age,
      annualEntitlement: ent.days, rule: ent.rule, totalUsed: empUsed, totalRemaining: ent.days - empUsed
    });
  }
  return success(res, { summary: { totalEmployees: result.length, totalEntitled, totalUsed, totalRemaining, year }, employees: result }, 'Izin raporu');
});

const exportLeaveReport = catchAsync(async (req, res) => {
  const where = { status: 'ACTIVE' };
  if (req.query.departmentId) where.departmentId = req.query.departmentId;
  const employees = await Employee.findAll({ where, include: [{ model: Department, as: 'department' }, { model: Position, as: 'position' }], order: [['firstName', 'ASC']] });
  const year = Number(req.query.year) || new Date().getFullYear();
  const headers = ['Personel No', 'Ad', 'Soyad', 'Departman', 'Pozisyon', 'Ise Giris', 'Kidem', 'Yas', 'Hak', 'Kullanilan', 'Kalan', 'Kural'];
  const rows = [];
  for (const emp of employees) {
    const ent = calculateAnnualLeaveEntitlement(emp.hireDate, emp.dateOfBirth);
    const bals = await LeaveBalance.findAll({ where: { employeeId: emp.id, year } });
    const used = bals.reduce((a, b) => a + Number(b.usedDays), 0);
    rows.push([emp.employeeNo||'', emp.firstName, emp.lastName, emp.department?emp.department.name:'', emp.position?emp.position.title:'', emp.hireDate, ent.seniority, ent.age, ent.days, used, ent.days-used, ent.rule]);
  }
  const csv = '\xEF\xBB\xBF' + headers.join(';') + '\n' + rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(';')).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="izin_raporu_'+year+'.csv"');
  res.send(csv);
});

module.exports = { getLeaveReport, exportLeaveReport };
