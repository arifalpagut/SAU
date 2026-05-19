require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Department, Position, Employee, User, LeaveType } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const [hrDept] = await Department.findOrCreate({ where: { name: 'Insan Kaynaklari' }, defaults: { description: 'IK Departmani' } });
    const [itDept] = await Department.findOrCreate({ where: { name: 'Bilgi Teknolojileri' }, defaults: { description: 'BT Departmani' } });
    const [hrManagerPos] = await Position.findOrCreate({ where: { title: 'HR Manager', departmentId: hrDept.id }, defaults: { level: 5, departmentId: hrDept.id } });
    const [employeePos] = await Position.findOrCreate({ where: { title: 'Software Specialist', departmentId: itDept.id }, defaults: { level: 3, departmentId: itDept.id } });

    const [adminEmployee] = await Employee.findOrCreate({ where: { email: 'admin@erp.local' }, defaults: { firstName: 'System', lastName: 'Admin', nationalId: '11111111111', email: 'admin@erp.local', phone: '5551111111', dateOfBirth: '1990-01-01', hireDate: '2024-01-01', departmentId: hrDept.id, positionId: hrManagerPos.id, grossSalary: 60000 } });
    const [hrEmployee] = await Employee.findOrCreate({ where: { email: 'hr@erp.local' }, defaults: { firstName: 'Ayse', lastName: 'Yilmaz', nationalId: '22222222222', email: 'hr@erp.local', phone: '5552222222', dateOfBirth: '1992-03-03', hireDate: '2024-02-01', departmentId: hrDept.id, positionId: hrManagerPos.id, grossSalary: 45000 } });
    const [normalEmployee] = await Employee.findOrCreate({ where: { email: 'employee@erp.local' }, defaults: { firstName: 'Mehmet', lastName: 'Kaya', nationalId: '33333333333', email: 'employee@erp.local', phone: '5553333333', dateOfBirth: '1995-05-05', hireDate: '2024-04-01', departmentId: itDept.id, positionId: employeePos.id, grossSalary: 35000 } });

    const adminHash = await bcrypt.hash('Admin123!', 10);
    const hrHash = await bcrypt.hash('Hr123456!', 10);
    const empHash = await bcrypt.hash('Employee123!', 10);

    await User.findOrCreate({ where: { email: 'admin@erp.local' }, defaults: { email: 'admin@erp.local', passwordHash: adminHash, role: 'ADMIN', employeeId: adminEmployee.id } });
    await User.findOrCreate({ where: { email: 'hr@erp.local' }, defaults: { email: 'hr@erp.local', passwordHash: hrHash, role: 'HR_MANAGER', employeeId: hrEmployee.id } });
    await User.findOrCreate({ where: { email: 'employee@erp.local' }, defaults: { email: 'employee@erp.local', passwordHash: empHash, role: 'EMPLOYEE', employeeId: normalEmployee.id } });

    await LeaveType.findOrCreate({ where: { name: 'Yillik Izin' }, defaults: { defaultDays: 14, isPaid: true, requiresApproval: true } });
    await LeaveType.findOrCreate({ where: { name: 'Mazeret Izni' }, defaults: { defaultDays: 5, isPaid: true, requiresApproval: true } });

    console.log('Seed islemi tamamlandi.');
    process.exit(0);
  } catch (error) {
    console.error('Seed hatasi:', error);
    process.exit(1);
  }
}

seed();
