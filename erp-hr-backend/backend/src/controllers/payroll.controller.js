const payrollService = require('../services/payroll.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const runPayroll = catchAsync(async (req, res) => {
  const data = await payrollService.runPayroll(req.body.month, req.body.year);
  res.locals.audit = { action: 'RUN_PAYROLL', entityType: 'payrolls', newValues: req.body };
  return success(res, data, 'Bordro hesaplama tamamlandi');
});
const listPayrolls = catchAsync(async (req, res) => { return success(res, await payrollService.listPayrolls(req.query), 'Bordro listesi getirildi'); });
const getPayrollById = catchAsync(async (req, res) => { return success(res, await payrollService.getPayrollById(req.params.id, req.user), 'Bordro detayi getirildi'); });
const getMyPayrolls = catchAsync(async (req, res) => { return success(res, await payrollService.getMyPayrolls(req.user), 'Kendi bordrolariniz getirildi'); });
const approvePayroll = catchAsync(async (req, res) => {
  const data = await payrollService.approvePayroll(req.params.id);
  res.locals.audit = { action: 'APPROVE', entityType: 'payrolls', entityId: data.id };
  return success(res, data, 'Bordro onaylandi');
});
const getCostReport = catchAsync(async (req, res) => { return success(res, await payrollService.getCostReport(req.query), 'Maliyet raporu getirildi'); });

module.exports = { runPayroll, listPayrolls, getPayrollById, getMyPayrolls, approvePayroll, getCostReport };
