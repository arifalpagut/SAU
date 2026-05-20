const { Payroll, PayrollItem, Employee, Department, Position } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

const exportSinglePayroll = catchAsync(async (req, res) => {
  const payroll = await Payroll.findByPk(req.params.id, {
    include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }, { model: Position, as: 'position' }] }]
  });
  if (!payroll) throw new AppError('Bordro bulunamadi', 404);
  const e = payroll.employee;
  const B = String.fromCharCode(0xEF,0xBB,0xBF);
  const NL = String.fromCharCode(10);
  const L = [];
  L.push('BORDRO DETAY RAPORU');
  L.push('');
  L.push('Ad Soyad;' + (e ? e.firstName+' '+e.lastName : ''));
  L.push('Personel No;' + (e ? e.employeeNo||'' : ''));
  L.push('Departman;' + (e&&e.department ? e.department.name : ''));
  L.push('Pozisyon;' + (e&&e.position ? e.position.title : ''));
  L.push('Donem;' + payroll.periodMonth+'/'+payroll.periodYear);
  L.push('');
  L.push('GELIRLER;Tutar');
  L.push('Brut Maas;' + Number(payroll.grossSalary||0).toFixed(2));
  L.push('Ek Odeme;' + Number(payroll.bonusPayment||0).toFixed(2));
  L.push('Fazla Mesai;' + Number(payroll.overtimePayment||0).toFixed(2));
  L.push('Yol Yardimi;' + Number(payroll.transportationAllowance||0).toFixed(2));
  L.push('Yemek Yardimi;' + Number(payroll.mealAllowance||0).toFixed(2));
  L.push('Diger Kazanc;' + Number(payroll.otherEarnings||0).toFixed(2));
  L.push('TOPLAM BRUT;' + Number(payroll.totalGrossEarnings||payroll.grossSalary||0).toFixed(2));
  L.push('');
  L.push('KESINTILER;Tutar');
  L.push('GV Matrahi;' + Number(payroll.incomeTaxBase||0).toFixed(2));
  L.push('SGK Isci;' + Number(payroll.employeeSgkPremium||0).toFixed(2));
  L.push('Issizlik Isci;' + Number(payroll.employeeUnemploymentPremium||0).toFixed(2));
  L.push('Gelir Vergisi;' + Number(payroll.incomeTax||0).toFixed(2));
  L.push('Damga Vergisi;' + Number(payroll.stampTax||0).toFixed(2));
  L.push('BES;' + Number(payroll.besDeduction||0).toFixed(2));
  L.push('Avans;' + Number(payroll.advanceDeduction||0).toFixed(2));
  L.push('Icra;' + Number(payroll.enforcementDeduction||0).toFixed(2));
  L.push('Diger;' + Number(payroll.otherDeductions||0).toFixed(2));
  L.push('');
  L.push('Toplam Kesinti;' + Number(payroll.totalDeductions||0).toFixed(2));
  L.push('NET MAAS;' + Number(payroll.netSalary||0).toFixed(2));
  L.push('');
  L.push('ISVEREN;Tutar');
  L.push('SGK Isveren;' + Number(payroll.employerSgkPremium||0).toFixed(2));
  L.push('Issizlik Isveren;' + Number(payroll.employerUnemploymentPremium||0).toFixed(2));
  L.push('TOPLAM ISVEREN;' + Number(payroll.totalEmployerCost||0).toFixed(2));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="bordro_detay.csv"');
  res.send(B + L.join(NL));
});

const exportBulkPayroll = catchAsync(async (req, res) => {
  var where = {};
  if (req.query.year) where.periodYear = Number(req.query.year);
  if (req.query.month && Number(req.query.month) > 0) where.periodMonth = Number(req.query.month);
  if (req.query.employeeId) {
    var ids = req.query.employeeId.split(',').filter(function(x) { return x && x.trim(); });
    if (ids.length === 1) where.employeeId = ids[0];
    else if (ids.length > 1) where.employeeId = { [Op.in]: ids };
  }
  var payrolls = await Payroll.findAll({
    where: where,
    include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }, { model: Position, as: 'position' }] }],
    order: [['periodYear','DESC'],['periodMonth','DESC']]
  });
  if (req.query.departmentId) {
    var deptIds = req.query.departmentId.split(',').filter(function(x) { return x && x.trim(); });
    if (deptIds.length > 0) {
      payrolls = payrolls.filter(function(p) {
        return p.employee && p.employee.departmentId && deptIds.indexOf(p.employee.departmentId) !== -1;
      });
    }
  }
  var B = String.fromCharCode(0xEF,0xBB,0xBF);
  var NL = String.fromCharCode(10);
  var h = ['Personel No','Ad','Soyad','Departman','Pozisyon','Ay','Yil','Brut Maas','Ek Odeme','Fazla Mesai','Yol','Yemek','Diger Kazanc','Toplam Brut','SGK Isci','Issizlik Isci','GV Matrahi','Gelir Vergisi','Damga Vergisi','BES','Avans','Icra','Diger Kesinti','Toplam Kesinti','Net Maas','SGK Isveren','Issizlik Isveren','Toplam Isveren','Durum'];
  var rows = payrolls.map(function(p) {
    var e = p.employee;
    return [e?e.employeeNo||'':'', e?e.firstName:'', e?e.lastName:'', e&&e.department?e.department.name:'', e&&e.position?e.position.title:'',
      p.periodMonth, p.periodYear,
      Number(p.grossSalary||0).toFixed(2), Number(p.bonusPayment||0).toFixed(2), Number(p.overtimePayment||0).toFixed(2),
      Number(p.transportationAllowance||0).toFixed(2), Number(p.mealAllowance||0).toFixed(2), Number(p.otherEarnings||0).toFixed(2),
      Number(p.totalGrossEarnings||p.grossSalary||0).toFixed(2), Number(p.employeeSgkPremium||0).toFixed(2),
      Number(p.employeeUnemploymentPremium||0).toFixed(2), Number(p.incomeTaxBase||0).toFixed(2),
      Number(p.incomeTax||0).toFixed(2), Number(p.stampTax||0).toFixed(2),
      Number(p.besDeduction||0).toFixed(2), Number(p.advanceDeduction||0).toFixed(2),
      Number(p.enforcementDeduction||0).toFixed(2), Number(p.otherDeductions||0).toFixed(2),
      Number(p.totalDeductions||0).toFixed(2), Number(p.netSalary||0).toFixed(2),
      Number(p.employerSgkPremium||0).toFixed(2), Number(p.employerUnemploymentPremium||0).toFixed(2),
      Number(p.totalEmployerCost||0).toFixed(2), p.status];
  });
  var csv = B + h.join(';') + NL + rows.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"';}).join(';');}).join(NL);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="bordro_rapor.csv"');
  res.send(csv);
});

module.exports = { exportSinglePayroll, exportBulkPayroll };