import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Input from '../../components/common/Input';
import { formatDateTime } from '../../utils/formatDate';

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, loading } = useFetch(() => api.get('/api/audit-logs', { params: { page, limit: 20, action: action || undefined, entityType: entityType || undefined, startDate: startDate || undefined, endDate: endDate || undefined } }), [page, action, entityType, startDate, endDate]);

  if (loading) return <LoadingSpinner />;
  const logs = data?.items || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Audit Log</h1><p className="text-sm text-gray-500 mt-1">Sistem işlem geçmişi</p></div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <select value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Tum Moduller</option>
            <option value="employees">Personel</option><option value="departments">Departman</option><option value="positions">Pozisyon</option>
            <option value="leaves">Izin</option><option value="payrolls">Bordro</option><option value="evaluations">Performans</option>
            <option value="auth">Giris</option>
          </select>
          <input type="text" placeholder="İşlem ara..." value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

      <Table headers={['Tarih', 'Kullanici', 'İşlem', 'Modul', 'IP']}>
        {logs.map((log) => (
          <tr key={log.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
            <td className="px-6 py-4 text-sm">{log.user?.employee ? `${log.user.employee.firstName} ${log.user.employee.lastName}` : log.user?.email || '-'}</td>
            <td className="px-6 py-4"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">{log.action}</span></td>
            <td className="px-6 py-4 text-sm text-gray-500">{log.entityType}</td>
            <td className="px-6 py-4 text-xs text-gray-400 font-mono">{log.ipAddress || '-'}</td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}