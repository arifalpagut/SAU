import { useState } from 'react';
import { FiPlus, FiEdit2, FiPlay, FiLock } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { performanceService } from '../../services/performanceService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';

export default function PeriodListPage() {
  const { data: periods, loading, refetch } = useFetch(() => performanceService.listPeriods(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', status: 'DRAFT' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', startDate: '', endDate: '', status: 'DRAFT' });
    setIsOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, startDate: p.startDate, endDate: p.endDate, status: p.status });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await performanceService.updatePeriod(editingId, form);
      } else {
        await performanceService.createPeriod(form);
      }
      setIsOpen(false);
      setEditingId(null);
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await performanceService.updatePeriod(id, { status: newStatus });
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Değerlendirme Dönemleri</h1>
        <Button onClick={openCreate}><FiPlus className="mr-2 h-4 w-4" />Yeni Dönem</Button>
      </div>
      <Table headers={['Dönem Adi', 'Başlangıç', 'Bitiş', 'Durum', 'İşlem']}>
        {(periods || []).map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(p.startDate)}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(p.endDate)}</td>
            <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="text-primary-600 hover:text-primary-800" title="Düzenle"><FiEdit2 className="h-4 w-4" /></button>
                {p.status === 'DRAFT' && (
                  <button onClick={() => handleStatusChange(p.id, 'ACTIVE')} className="text-green-600 hover:text-green-800" title="Aktif Et"><FiPlay className="h-4 w-4" /></button>
                )}
                {p.status === 'ACTIVE' && (
                  <button onClick={() => handleStatusChange(p.id, 'CLOSED')} className="text-red-600 hover:text-red-800" title="Kapat"><FiLock className="h-4 w-4" /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? 'Dönem Düzenle' : 'Yeni Dönem'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Dönem Adi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="2026 Q1" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Başlangıç" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <Input label="Bitiş" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="DRAFT">Taslak</option><option value="ACTIVE">Aktif</option><option value="CLOSED">Kapali</option>
            </select>
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