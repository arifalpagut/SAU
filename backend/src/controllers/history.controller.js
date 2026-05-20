const { EmployeeHistory, User, Employee } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const getChangeHistory = catchAsync(async (req, res) => {
  const history = await EmployeeHistory.findAll({
    where: { employeeId: req.params.id },
    order: [['createdAt', 'DESC']]
  });
  return success(res, history, 'Degisiklik gecmisi');
});

module.exports = { getChangeHistory };