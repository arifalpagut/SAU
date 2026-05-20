import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiUsers, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DepartmentPage() {
  const { data: departments, loading, refetch } = useFetch(() => api.get('/api/departments'), []);
  const [employees, setEmployees] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedDept, setExpandedDept] = useState(null);
  const [deptEmployees, setDeptEmployees] = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '', managerId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/employees?limit=100').then(r => setEmployees(r.data.data?.items || []));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', code: '', description: '', managerId: '' });
    setIsOpen(true);
  };

  const openEdit = (dept) => {
    setEditingId(dept.id);
    setForm({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      managerId: dept.managerId || dept.manager_id || ''
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.managerId) delete payload.managerId;
      if (editingId) {
        await api.put('/api/departments/' + editingId, payload);
      } else {
        await api.post('/api/departments', payload);
      }
      setIsOpen(false);
      setEditingId(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Hata');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    const dept = (departments || []).find(d => d.id === id);
    if (!dept) return;
    try {
      await api.put('/api/departments/' + id, { isActive: !dept.isActive });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Hata');
    }
  };

  const toggleExpand = async (deptId) => {
    if (expandedDept === deptId) {
      setExpandedDept(null);
      setDeptEmployees([]);
      return;
    }
    setExpandedDept(deptId);
    setLoadingEmps(true);
    try {
      const { data } = await api.get('/api/departments/' + deptId + '/employees');
      setDeptEmployees(data.data?.employees || []);
    } catch (err) {
      setDeptEmployees([]);
    } finally {
      setLoadingEmps(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departmanlar</h1>
          <p className="text-sm text-gray-500 mt-1">{(departments || []).length} departman</p>
        </div>
        <Button onClick={openCreate}><FiPlus className="mr-2 h-4 w-4" />Yeni Departman</Button>
      </div>

      <div className="space-y-3">
        {(departments || []).map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-sm">{dept.code || 'DEP'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{dept.name}</h3>
                    <StatusBadge status={dept.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                  {dept.description && <p className="text-xs text-gray-500 mt-0.5">{dept.description}</p>}
                  <div className="flex items-center gap-4 mt-1">
                    {dept.manager && (
                      <span className="text-xs text-gray-400">Yönetici: {dept.manager.firstName} {dept.manager.lastName}</span>
                    )}
                    <span className="text-xs text-gray-400">Kod: {dept.code || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleExpand(dept.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <FiUsers className="h-4 w-4" />
                  <span className="font-medium">{dept.employeeCount || 0}</span>
                  {expandedDept === dept.id ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />}
                </button>
                <button onClick={() => openEdit(dept)} className="text-primary-600 hover:text-primary-800 p-1" title="Düzenle">
                  <FiEdit2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expandedDept === dept.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-4">
                {loadingEmps ? (
                  <p className="text-sm text-gray-400 text-center py-4">Yükleniyor...</p>
                ) : deptEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {deptEmployees.map(emp => (
                      <div key={emp.id} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-gray-400">{emp.position?.title || '-'}</p>
                        </div>
                        <div className="ml-auto">
                          <StatusBadge status={emp.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">Bu departmanda çalışan bulunmuyor</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? 'Departman Düzenle' : 'Yeni Departman'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Departman Adi *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Orn: Bilgi Teknolojileri" required />
          <Input label="Departman Kodu" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Orn: DEP-004" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departman Yöneticisi</label>
            <select value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Seçiniz (opsiyonel)</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Departman açıklamasi..." />
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