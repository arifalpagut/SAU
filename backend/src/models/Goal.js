module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    periodId: { type: DataTypes.UUID, allowNull: false, field: 'period_id' },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    weight: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    selfScore: { type: DataTypes.DECIMAL(3, 1), allowNull: true, field: 'self_score' },
    managerScore: { type: DataTypes.DECIMAL(3, 1), allowNull: true, field: 'manager_score' },
    finalScore: { type: DataTypes.DECIMAL(3, 1), allowNull: true, field: 'final_score' }
  }, { tableName: 'goals' });
  return Goal;
};
