const { Employee, Department, Position } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const getOrgChart = catchAsync(async (req, res) => {
  const employees = await Employee.findAll({
    where: { status: 'ACTIVE' },
    include: [
      { model: Department, as: 'department' },
      { model: Position, as: 'position' }
    ],
    order: [['firstName', 'ASC']]
  });

  const empMap = {};
  employees.forEach(e => {
    empMap[e.id] = {
      id: e.id, employeeNo: e.employeeNo,
      firstName: e.firstName, lastName: e.lastName,
      photo: e.photo || null,
      department: e.department ? e.department.name : '',
      position: e.position ? e.position.title : '',
      managerId: e.managerId,
      children: []
    };
  });

  const roots = [];
  Object.values(empMap).forEach(emp => {
    if (emp.managerId && empMap[emp.managerId]) {
      empMap[emp.managerId].children.push(emp);
    } else {
      roots.push(emp);
    }
  });

  return success(res, roots, 'Organizasyon semasi');
});

module.exports = { getOrgChart };