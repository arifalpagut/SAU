module.exports = (sequelize, DataTypes) => {
  const PerformanceCriterion = sequelize.define('PerformanceCriterion', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    weight: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 20 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' }
  }, { tableName: 'performance_criteria' });
  return PerformanceCriterion;
};