import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DepartmentPage() {
  const { data: departments, loading, refetch } = useFetch(() => api.get('/api/departments'), []);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/departments', form);
      setIsOpen(false);
      setForm({ name: '', description: '' });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Hata');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Departmanlar</h1>
        <Button onClick={() => setIsOpen(true)}><FiPlus className="mr-2 h-4 w-4" />Yeni Departman</Button>
      </div>
      <Table headers={['Departman Adı', 'Açıklama', 'Durum']}>
        {(departments || []).map((dept) => (
          <tr key={dept.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{dept.description || '-'}</td>
            <td className="px-6 py-4"><StatusBadge status={dept.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Yeni Departman">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Departman Adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>İptal</Button>
            <Button type="submit" loading={saving}>Kaydet</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
