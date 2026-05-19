import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiUsers } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';

export default function PositionPage() {
  const { data: positions, loading, refetch } = useFetch(() => api.get('/api/positions'), []);
  const [departments, setDepartments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', level: 1, departmentId: '', description: '', minSalary: 0, maxSalary: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/api/departments').then(r => setDepartments(r.data.data || [])); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', level: 1, departmentId: '', description: '', minSalary: 0, maxSalary: 0, isActive: true });
    setIsOpen(true);
  };
  const openEdit = (pos) => {
    setEditingId(pos.id);
    setForm({ title: pos.title, level: pos.level, departmentId: pos.departmentId || pos.department_id || '', description: pos.description || '', minSalary: pos.minSalary || pos.min_salary || 0, maxSalary: pos.maxSalary || pos.max_salary || 0, isActive: pos.isActive !== false });
    setIsOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) await api.put('/api/positions/' + editingId, form);
      else await api.post('/api/positions', form);
      setIsOpen(false); setEditingId(null); refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pozisyonlar</h1>
          <p className="text-sm text-gray-500 mt-1">{(positions || []).length} pozisyon tanimli</p>
        </div>
        <Button onClick={openCreate}><FiPlus className="mr-2 h-4 w-4" />Yeni Pozisyon</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(positions || []).map((pos) => (
          <div key={pos.id} className={`bg-white rounded-xl shadow-sm border p-5 ${pos.isActive === false ? 'opacity-50 border-gray-300' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{pos.title}</h3>
                <p className="text-xs text-gray-500">{pos.department?.name || '-'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Seviye {pos.level}</span>
                <button onClick={() => openEdit(pos)} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="h-4 w-4" /></button>
              </div>
            </div>
            {pos.description && <p className="text-xs text-gray-400 mb-3">{pos.description}</p>}
            {(Number(pos.minSalary || pos.min_salary || 0) > 0 || Number(pos.maxSalary || pos.max_salary || 0) > 0) && (
              <div className="bg-green-50 rounded-lg p-2 mb-3">
                <p className="text-xs text-green-600 font-medium">Maaş Araligi</p>
                <p className="text-sm font-semibold text-green-800">
                  {formatCurrency(pos.minSalary || pos.min_salary || 0)} - {formatCurrency(pos.maxSalary || pos.max_salary || 0)}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <FiUsers className="h-3 w-3" />
                <span>{pos.employeeCount || 0} çalışan</span>
              </div>
              <StatusBadge status={pos.isActive === false ? 'INACTIVE' : 'ACTIVE'} />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? 'Pozisyon Düzenle' : 'Yeni Pozisyon'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Pozisyon Adi *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Orn: Yazilim Uzmani" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Seviye (1-10)" type="number" min="1" max="10" value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departman *</label>
              <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Seçiniz</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Minimum Maaş (TL)" type="number" min="0" value={form.minSalary} onChange={(e) => setForm({ ...form, minSalary: Number(e.target.value) })} />
            <Input label="Maksimum Maaş (TL)" type="number" min="0" value={form.maxSalary} onChange={(e) => setForm({ ...form, maxSalary: Number(e.target.value) })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Aktif pozisyon</label>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>İptal</Button>
            <Button type="submit" loading={saving}>{editingId ? 'Güncelle' : 'Oluştur'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}