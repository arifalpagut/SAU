module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    code: { type: DataTypes.STRING(20), allowNull: true, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    parentId: { type: DataTypes.UUID, allowNull: true, field: 'parent_id' },
    managerId: { type: DataTypes.UUID, allowNull: true, field: 'manager_id' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' }
  }, { tableName: 'departments' });
  return Department;
};