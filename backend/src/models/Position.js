module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    positionCode: { type: DataTypes.STRING(20), allowNull: true, unique: true, field: 'position_code' },
    title: { type: DataTypes.STRING(100), allowNull: false },
    level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    jobLevel: { type: DataTypes.STRING(20), allowNull: true, defaultValue: 'SPECIALIST', field: 'job_level' },
    description: { type: DataTypes.TEXT, allowNull: true },
    minSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'min_salary' },
    maxSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'max_salary' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    departmentId: { type: DataTypes.UUID, allowNull: false, field: 'department_id' }
  }, { tableName: 'positions' });
  return Position;
};