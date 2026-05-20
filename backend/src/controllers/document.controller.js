const { EmployeeDocument } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');
const AppError = require('../utils/AppError');

const DOC_TYPES = { KIMLIK: 'Kimlik', DIPLOMA: 'Diploma', IKAMETGAH: 'Ikametgah', SAGLIK_RAPORU: 'Saglik Raporu', IS_SOZLESMESI: 'Is Sozlesmesi', GIZLILIK_SOZLESMESI: 'Gizlilik Sozlesmesi', KVKK: 'KVKK Metni', SERTIFIKA: 'Sertifika', IZIN_FORMU: 'Izin Formu', DIGER: 'Diger' };

const listDocuments = catchAsync(async (req, res) => {
  const docs = await EmployeeDocument.findAll({
    where: { employeeId: req.params.id, status: 'ACTIVE' },
    attributes: { exclude: ['fileData'] },
    order: [['createdAt', 'DESC']]
  });
  return success(res, docs, 'Belgeler');
});

const uploadDocument = catchAsync(async (req, res) => {
  const { documentType, title, fileData, fileName, fileSize, expiresAt, notes } = req.body;
  if (!documentType || !title) throw new AppError('Belge turu ve baslik zorunlu', 400);
  const doc = await EmployeeDocument.create({
    employeeId: req.params.id, documentType, title, fileData: fileData || null,
    fileName: fileName || '', fileSize: fileSize || 0, uploadedBy: req.user.id,
    expiresAt: expiresAt || null, notes: notes || ''
  });
  return success(res, { id: doc.id, documentType: doc.documentType, title: doc.title, fileName: doc.fileName, createdAt: doc.createdAt }, 'Belge yuklendi', 201);
});

const downloadDocument = catchAsync(async (req, res) => {
  const doc = await EmployeeDocument.findOne({ where: { id: req.params.docId, employeeId: req.params.id } });
  if (!doc) throw new AppError('Belge bulunamadi', 404);
  return success(res, doc, 'Belge detayi');
});

const deleteDocument = catchAsync(async (req, res) => {
  const doc = await EmployeeDocument.findOne({ where: { id: req.params.docId, employeeId: req.params.id } });
  if (!doc) throw new AppError('Belge bulunamadi', 404);
  await doc.update({ status: 'DELETED' });
  return success(res, null, 'Belge silindi');
});

module.exports = { listDocuments, uploadDocument, downloadDocument, deleteDocument };