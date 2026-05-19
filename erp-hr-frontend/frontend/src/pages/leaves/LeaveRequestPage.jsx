import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LeaveRequestPage() {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    leaveService.getTypes().then(r => setLeaveTypes(r.data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await leaveService.create(form);
      navigate('/leaves');
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">İzin Talebi Oluştur</h1>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İzin Türü</label>
          <select value={form.leaveTypeId} onChange={(e) => setForm({ ...form, leaveTypeId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
            <option value="">Seçiniz</option>
            {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name} ({t.defaultDays} gün)</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Başlangıç Tarihi" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          <Input label="Bitiş Tarihi" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/leaves')}>İptal</Button>
          <Button type="submit" loading={loading}>Talep Oluştur</Button>
        </div>
      </form>
    </div>
  );
}
