import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { leaveService } from '../../services/leaveService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';

export default function LeaveListPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const { data: leaves, loading, refetch } = useFetch(() => leaveService.list({ status: status || undefined }), [status]);

  const handleCancel = async (id) => {
    if (!confirm('Bu izin talebini iptal etmek istediginize emin misiniz?')) return;
    try { await leaveService.cancel(id); refetch(); }
    catch (err) { alert(err.response?.data?.message || 'Hata'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">İzin Talepleri</h1>
        <Link to="/leaves/request"><Button><FiPlus className="mr-2 h-4 w-4" />İzin Talebi</Button></Link>
      </div>
      <div className="flex gap-2">
        {['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            {s === '' ? 'Tumu' : s === 'PENDING' ? 'Bekleyen' : s === 'APPROVED' ? 'Onayli' : s === 'REJECTED' ? 'Reddedilen' : 'İptal'}
          </button>
        ))}
      </div>
      <Table headers={['Çalışan', 'İzin Türü', 'Başlangıç', 'Bitiş', 'Gun', 'Durum', 'İşlem']}>
        {(leaves || []).map((leave) => (
          <tr key={leave.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{leave.employee?.firstName} {leave.employee?.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{leave.leaveType?.name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(leave.startDate)}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(leave.endDate)}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{leave.totalDays}</td>
            <td className="px-6 py-4"><StatusBadge status={leave.status} /></td>
            <td className="px-6 py-4">
              {leave.status === 'PENDING' && leave.employeeId === user?.employeeId && (
                <Button size="sm" variant="outline" onClick={() => handleCancel(leave.id)}>İptal</Button>
              )}
              {leave.status === 'REJECTED' && leave.rejectionReason && (
                <span className="text-xs text-red-500" title={leave.rejectionReason}>Red: {leave.rejectionReason.substring(0, 30)}...</span>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}