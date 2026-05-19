import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LeaveRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [form, setForm] = useState({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    leaveService.getTypes().then(r => setLeaveTypes(r.data.data || []));
    leaveService.getBalance('').then(r => setBalances(r.data.data || [])).catch(() => {});
  }, []);

  const selectedBalance = balances.find(b => b.leaveTypeId === form.leaveTypeId || b.leave_type_id === form.leaveTypeId);
  const selectedType = leaveTypes.find(t => t.id === form.leaveTypeId);

  const dayCount = form.startDate && form.endDate
    ? Math.max(0, Math.floor((new Date(form.endDate) - new Date(form.startDate)) / (1000*60*60*24)) + 1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await leaveService.create(form);
      navigate('/leaves');
    } catch (err) {
      setError(err.response?.data?.message || 'Hata olustu');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">İzin Talebi Oluştur</h1>

      {balances.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">İzin Bakiyeleriniz</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {balances.map((b, i) => (
              <div key={i} className={`rounded-lg p-3 text-center border ${form.leaveTypeId && (b.leaveTypeId === form.leaveTypeId || b.leave_type_id === form.leaveTypeId) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                <p className="text-xs text-gray-500">{b.leaveType?.name || 'Izin'}</p>
                <p className="text-lg font-bold text-gray-900">{Number(b.remainingDays || b.remaining_days || 0)}</p>
                <p className="text-xs text-gray-400">/ {Number(b.totalDays || b.total_days || 0)} gun</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İzin Türü *</label>
          <select value={form.leaveTypeId} onChange={(e) => setForm({ ...form, leaveTypeId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
            <option value="">Seçiniz</option>
            {leaveTypes.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.isPaid || t.is_paid ? 'Ücretli' : 'Ücretsiz'} - {t.defaultDays || t.default_days} gun)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Başlangıç Tarihi *" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          <Input label="Bitiş Tarihi *" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
        </div>

        {dayCount > 0 && (
          <div className={`p-3 rounded-lg border ${selectedBalance && dayCount > Number(selectedBalance.remainingDays || selectedBalance.remaining_days || 0) ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-sm font-medium ${selectedBalance && dayCount > Number(selectedBalance.remainingDays || selectedBalance.remaining_days || 0) ? 'text-red-700' : 'text-blue-700'}`}>
              Talep edilen: {dayCount} gun
              {selectedBalance && ` | Kalan bakiye: ${Number(selectedBalance.remainingDays || selectedBalance.remaining_days || 0)} gun`}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="İzin talebinizin nedenini yaziniz..." />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={() => navigate('/leaves')}>İptal</Button>
          <Button type="submit" loading={loading}>Talep Oluştur</Button>
        </div>
      </form>
    </div>
  );
}