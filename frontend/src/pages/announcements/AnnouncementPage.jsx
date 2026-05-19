import { useState } from 'react';
import { FiPlus, FiEdit2 } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';

const TYPE_LABELS = { GENERAL: 'Genel', HR: 'IK', POLICY: 'Politika', TRAINING: 'Egitim' };
const PRIO_LABELS = { LOW: 'Dusuk', NORMAL: 'Normal', HIGH: 'Yuksek', URGENT: 'Acil' };
const PRIO_COLORS = { LOW: 'bg-gray-100 text-gray-800', NORMAL: 'bg-blue-100 text-blue-800', HIGH: 'bg-orange-100 text-orange-800', URGENT: 'bg-red-100 text-red-800' };

export default function AnnouncementPage() {
  const { data: announcements, loading, refetch } = useFetch(() => api.get('/api/announcements'), []);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', type: 'GENERAL', priority: 'NORMAL', targetRoles: '', expiresAt: '' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditId(null); setForm({ title: '', content: '', type: 'GENERAL', priority: 'NORMAL', targetRoles: '', expiresAt: '' }); setIsOpen(true); };
  const openEdit = (a) => { setEditId(a.id); setForm({ title: a.title, content: a.content || '', type: a.type, priority: a.priority, targetRoles: a.targetRoles || '', expiresAt: a.expiresAt || '' }); setIsOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { if (editId) await api.put('/api/announcements/' + editId, form); else await api.post('/api/announcements', form); setIsOpen(false); refetch(); }
    catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu duyuruyu pasife almak istediginize emin misiniz?')) return;
    try { await api.delete('/api/announcements/' + id); refetch(); } catch {}
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Duyurular</h1><p className="text-sm text-gray-500 mt-1">{(announcements || []).length} duyuru</p></div>
        <Button onClick={openCreate}><FiPlus className="mr-2 h-4 w-4" />Yeni Duyuru</Button>
      </div>
      <div className="space-y-3">
        {(announcements || []).map(a => (
          <div key={a.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${!a.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{a.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIO_COLORS[a.priority]}`}>{PRIO_LABELS[a.priority]}</span>
                  <span className="text-xs text-gray-400">{TYPE_LABELS[a.type]}</span>
                </div>
                {a.content && <p className="text-sm text-gray-600 mt-1">{a.content}</p>}
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>Yayinlanma: {formatDate(a.publishedAt)}</span>
                  {a.expiresAt && <span>Bitiş: {formatDate(a.expiresAt)}</span>}
                  {a.targetRoles && <span>Hedef: {a.targetRoles}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={a.isActive ? 'ACTIVE' : 'INACTIVE'} />
                <button onClick={() => openEdit(a)} className="text-primary-600 hover:text-primary-800"><FiEdit2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Duyuru Düzenle' : 'Yeni Duyuru'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Başlık *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="4" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tur</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="GENERAL">Genel</option><option value="HR">IK</option><option value="POLICY">Politika</option><option value="TRAINING">Egitim</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="LOW">Dusuk</option><option value="NORMAL">Normal</option><option value="HIGH">Yuksek</option><option value="URGENT">Acil</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Hedef Roller (virgul ile)" value={form.targetRoles} onChange={(e) => setForm({ ...form, targetRoles: e.target.value })} placeholder="EMPLOYEE,MANAGER (bos = herkes)" />
            <Input label="Bitiş Tarihi" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsOpen(false)}>İptal</Button><Button type="submit" loading={saving}>{editId ? 'Güncelle' : 'Yayinla'}</Button></div>
        </form>
      </Modal>
    </div>
  );
}