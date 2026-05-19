const { Employee, Department, Position } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

const WORK_TYPE_LABELS = { FULL_TIME: 'Tam Zamanli', PART_TIME: 'Yari Zamanli', INTERN: 'Stajyer', CONTRACT: 'Sozlesmeli' };
const STATUS_LABELS = { ACTIVE: 'Aktif', INACTIVE: 'Pasif', TERMINATED: 'Ayrilmis', ON_LEAVE: 'Izinli' };

const exportExcel = catchAsync(async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.departmentId) where.departmentId = req.query.departmentId;
  if (req.query.workType) where.workType = req.query.workType;
  if (req.query.search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: '%' + req.query.search + '%' } },
      { lastName: { [Op.iLike]: '%' + req.query.search + '%' } },
      { email: { [Op.iLike]: '%' + req.query.search + '%' } },
      { nationalId: { [Op.iLike]: '%' + req.query.search + '%' } },
      { employeeNo: { [Op.iLike]: '%' + req.query.search + '%' } }
    ];
  }

  const employees = await Employee.findAll({
    where,
    include: [
      { model: Department, as: 'department' },
      { model: Position, as: 'position' }
    ],
    order: [['employeeNo', 'ASC']]
  });

  // BOM for Excel UTF-8 compatibility
  const BOM = '\xEF\xBB\xBF';
  const headers = ['Personel No', 'Ad', 'Soyad', 'TC Kimlik No', 'E-posta', 'Telefon', 'Departman', 'Pozisyon', 'Calisma Tipi', 'Durum', 'Ise Giris Tarihi', 'Brut Maas'];
  
  const rows = employees.map(emp => [
    emp.employeeNo || '',
    emp.firstName || '',
    emp.lastName || '',
    emp.nationalId || '',
    emp.email || '',
    emp.phone || '',
    emp.department ? emp.department.name : '',
    emp.position ? emp.position.title : '',
    WORK_TYPE_LABELS[emp.workType] || emp.workType || '',
    STATUS_LABELS[emp.status] || emp.status || '',
    emp.hireDate || '',
    emp.grossSalary || ''
  ]);

  const csvContent = BOM + headers.join(';') + '\n' + rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(';')).join('\n');

  const filename = 'personel_listesi_' + new Date().toISOString().split('T')[0] + '.csv';
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
  res.send(csvContent);
});

module.exports = { exportExcel };