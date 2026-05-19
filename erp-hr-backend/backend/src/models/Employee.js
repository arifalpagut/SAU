const { EMPLOYEE_STATUS } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING(100), allowNull: false, field: 'last_name' },
    nationalId: { type: DataTypes.STRING(11), allowNull: false, unique: true, field: 'national_id' },
    email: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false, field: 'date_of_birth' },
    hireDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'hire_date' },
    terminationDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'termination_date' },
    status: { type: DataTypes.ENUM(...Object.values(EMPLOYEE_STATUS)), allowNull: false, defaultValue: EMPLOYEE_STATUS.ACTIVE },
    departmentId: { type: DataTypes.UUID, allowNull: false, field: 'department_id' },
    positionId: { type: DataTypes.UUID, allowNull: false, field: 'position_id' },
    managerId: { type: DataTypes.UUID, allowNull: true, field: 'manager_id' },
    grossSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'gross_salary' }
  }, { tableName: 'employees' });
  return Employee;
};
