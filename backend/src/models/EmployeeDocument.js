module.exports = (sequelize, DataTypes) => {
  const EmployeeDocument = sequelize.define('EmployeeDocument', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    documentType: { type: DataTypes.STRING(50), allowNull: false, field: 'document_type' },
    title: { type: DataTypes.STRING(255), allowNull: false },
    fileData: { type: DataTypes.TEXT, allowNull: true, field: 'file_data' },
    fileName: { type: DataTypes.STRING(255), allowNull: true, field: 'file_name' },
    fileSize: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0, field: 'file_size' },
    uploadedBy: { type: DataTypes.UUID, allowNull: true, field: 'uploaded_by' },
    expiresAt: { type: DataTypes.DATEONLY, allowNull: true, field: 'expires_at' },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'ACTIVE' },
    notes: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'employee_documents' });
  return EmployeeDocument;
};