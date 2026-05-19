import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
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
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', status: 'DRAFT' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await performanceService.createPeriod(form);
      setIsOpen(false);
      setForm({ name: '', startDate: '', endDate: '', status: 'DRAFT' });
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Değerlendirme Dönemleri</h1>
        <Button onClick={() => setIsOpen(true)}><FiPlus className="mr-2 h-4 w-4" />Yeni Dönem</Button>
      </div>
      <Table headers={['Dönem Adı', 'Başlangıç', 'Bitiş', 'Durum']}>
        {(periods || []).map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(p.startDate)}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(p.endDate)}</td>
            <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Yeni Değerlendirme Dönemi">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Dönem Adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="2026 Q1" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Başlangıç" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <Input label="Bitiş" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="DRAFT">Taslak</option><option value="ACTIVE">Aktif</option><option value="CLOSED">Kapalı</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>İptal</Button>
            <Button type="submit" loading={saving}>Kaydet</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
