import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiEdit2, FiPlus } from 'react-icons/fi';

export default function ParameterPage() {
  const [tab, setTab] = useState('payroll');
  const { data: params, loading: pLoading, refetch: pRefetch } = useFetch(() => api.get('/api/parameters/payroll'), []);
  const { data: leaveTypes, loading: lLoading, refetch: lRefetch } = useFetch(() => api.get('/api/parameters/leave-types'), []);
  const [editModal, setEditModal] = useState({ open: false, item: null, type: '' });
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const openEditParam = (p) => { setForm({ parameterValue: p.parameterValue, description: p.description || '' }); setEditModal({ open: true, item: p, type: 'payroll' }); };
  const openEditLeave = (t) => { setForm({ name: t.name, defaultDays: t.defaultDays, isPaid: t.isPaid, requiresApproval: t.requiresApproval }); setEditModal({ open: true, item: t, type: 'leave' }); };
  const openCreateLeave = () => { setForm({ name: '', defaultDays: 0, isPaid: true, requiresApproval: true }); setEditModal({ open: true, item: null, type: 'leave-new' }); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editModal.type === 'payroll') { await api.put('/api/parameters/payroll/' + editModal.item.id, form); pRefetch(); }
      else if (editModal.type === 'leave') { await api.put('/api/parameters/leave-types/' + editModal.item.id, form); lRefetch(); }
      else if (editModal.type === 'leave-new') { await api.post('/api/parameters/leave-types', form); lRefetch(); }
      setEditModal({ open: false, item: null, type: '' });
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Parametre Yönetimi</h1>
      <div className="flex gap-2">
        <button onClick={() => setTab('payroll')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'payroll' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>Bordro Parametreleri</button>
        <button onClick={() => setTab('leave')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'leave' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>İzin Türleri</button>
      </div>

      {tab === 'payroll' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {pLoading ? <LoadingSpinner /> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Parametre</th><th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Deger</th><th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Yil</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Açıklama</th><th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">İşlem</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {(params || []).map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.parameterName}</td>
                    <td className="px-6 py-4 text-sm text-center font-mono text-primary-700">{p.parameterValue}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500">{p.year}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{p.description}</td>
                    <td className="px-6 py-4 text-center"><button onClick={() => openEditParam(p)} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'leave' && (
        <div>
          <div className="flex justify-end mb-4"><Button onClick={openCreateLeave}><FiPlus className="mr-2 h-4 w-4" />Yeni İzin Türü</Button></div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {lLoading ? <LoadingSpinner /> : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">İzin Türü</th><th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Gun</th><th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Ücretli</th><th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Onay</th><th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">İşlem</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {(leaveTypes || []).map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.name}</td>
                      <td className="px-6 py-4 text-sm text-center">{t.defaultDays}</td>
                      <td className="px-6 py-4 text-center">{(t.isPaid || t.is_paid) ? <span className="text-green-600 text-xs font-medium">Evet</span> : <span className="text-gray-400 text-xs">Hayir</span>}</td>
                      <td className="px-6 py-4 text-center">{(t.requiresApproval || t.requires_approval) ? <span className="text-blue-600 text-xs font-medium">Evet</span> : <span className="text-gray-400 text-xs">Hayir</span>}</td>
                      <td className="px-6 py-4 text-center"><button onClick={() => openEditLeave(t)} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, item: null, type: '' })} title={editModal.type === 'payroll' ? 'Parametre Düzenle' : editModal.type === 'leave-new' ? 'Yeni İzin Türü' : 'İzin Türü Düzenle'}>
        <div className="space-y-4">
          {editModal.type === 'payroll' ? (
            <>
              <Input label="Deger" type="number" step="0.00001" value={form.parameterValue} onChange={(e) => setForm({ ...form, parameterValue: e.target.value })} />
              <Input label="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </>
          ) : (
            <>
              <Input label="İzin Türü Adi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Varsayilan Gun" type="number" value={form.defaultDays} onChange={(e) => setForm({ ...form, defaultDays: Number(e.target.value) })} />
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPaid} onChange={(e) => setForm({ ...form, isPaid: e.target.checked })} className="rounded" /><span className="text-sm">Ücretli</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.requiresApproval} onChange={(e) => setForm({ ...form, requiresApproval: e.target.checked })} className="rounded" /><span className="text-sm">Onay Gerekli</span></label>
              </div>
            </>
          )}
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setEditModal({ open: false, item: null, type: '' })}>İptal</Button><Button onClick={handleSave} loading={saving}>Kaydet</Button></div>
        </div>
      </Modal>
    </div>
  );
}