import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { leaveService } from '../../services/leaveService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatDate';

export default function LeaveApprovalPage() {
  const { data: leaves, loading, refetch } = useFetch(() => leaveService.list({ status: 'PENDING' }), []);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [reason, setReason] = useState('');

  const handleApprove = async (id) => {
    if (!confirm('Bu izni onaylıyor musunuz?')) return;
    try { await leaveService.approve(id); refetch(); } catch (err) { alert(err.response?.data?.message || 'Hata'); }
  };

  const handleReject = async () => {
    try {
      await leaveService.reject(rejectModal.id, reason);
      setRejectModal({ open: false, id: null });
      setReason('');
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">İzin Onayları</h1>
      <Table headers={['Çalışan', 'İzin Türü', 'Tarih Aralığı', 'Gün', 'Açıklama', 'İşlem']}>
        {(leaves || []).map((leave) => (
          <tr key={leave.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{leave.employee?.firstName} {leave.employee?.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{leave.leaveType?.name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{leave.totalDays}</td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason || '-'}</td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <Button size="sm" variant="success" onClick={() => handleApprove(leave.id)}>Onayla</Button>
                <Button size="sm" variant="danger" onClick={() => setRejectModal({ open: true, id: leave.id })}>Reddet</Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={rejectModal.open} onClose={() => setRejectModal({ open: false, id: null })} title="İzin Reddi">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Red Gerekçesi</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" required />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRejectModal({ open: false, id: null })}>İptal</Button>
            <Button variant="danger" onClick={handleReject}>Reddet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
