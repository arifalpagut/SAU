import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { leaveService } from '../../services/leaveService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatDate';

export default function LeaveApprovalPage() {
  const { user } = useAuth();
  const { data: leaves, loading, refetch } = useFetch(() => leaveService.list({ status: 'PENDING' }), []);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(null);

  const handleApprove = async (id) => {
    if (!confirm('Bu izin talebini onaylamak istediginize emin misiniz?')) return;
    setProcessing(id);
    try {
      await leaveService.approve(id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Onay sirasinda hata olustu');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) { alert('Red gerekçesi zorunludur'); return; }
    setProcessing(rejectModal.id);
    try {
      await leaveService.reject(rejectModal.id, reason);
      setRejectModal({ open: false, id: null });
      setReason('');
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Red sirasinda hata olustu');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const pendingLeaves = leaves || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İzin Onaylari</h1>
          <p className="text-sm text-gray-500 mt-1">Ekibinizdeki çalışanlarin bekleyen izin talepleri</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-yellow-800">{pendingLeaves.length} bekleyen talep</span>
        </div>
      </div>

      {pendingLeaves.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-lg">Bekleyen izin talebi bulunmuyor</p>
          <p className="text-gray-300 text-sm mt-2">Ekibinizden bir izin talebi geldiginde burada gorunecek</p>
        </div>
      ) : (
        <Table headers={['Çalışan', 'Departman', 'İzin Türü', 'Tarih Araligi', 'Gun', 'Açıklama', 'İşlem']}>
          {pendingLeaves.map((leave) => (
            <tr key={leave.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{leave.employee?.firstName} {leave.employee?.lastName}</div>
                <div className="text-xs text-gray-400">{leave.employee?.position?.title || ''}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{leave.employee?.department?.name || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{leave.leaveType?.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{leave.totalDays} gun</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason || '-'}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="success" onClick={() => handleApprove(leave.id)} loading={processing === leave.id}>Onayla</Button>
                  <Button size="sm" variant="danger" onClick={() => setRejectModal({ open: true, id: leave.id })}>Reddet</Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={rejectModal.open} onClose={() => { setRejectModal({ open: false, id: null }); setReason(''); }} title="İzin Talebi Reddi" size="md">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">Red işlemini onayliyorsunuz. Lutfen gerekçe belirtiniz.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Red Gerekçesi *</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" rows="3" placeholder="Red gerekçenizi yaziniz..." required />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setRejectModal({ open: false, id: null }); setReason(''); }}>İptal</Button>
            <Button variant="danger" onClick={handleReject} loading={processing === rejectModal.id}>Reddet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}