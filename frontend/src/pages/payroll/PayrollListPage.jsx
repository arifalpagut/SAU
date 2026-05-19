import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { payrollService } from '../../services/payrollService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiCheck, FiXCircle, FiDownload } from 'react-icons/fi';

export default function PayrollListPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { isHR, isFinance } = usePermission();
  const { data: payrolls, loading, refetch } = useFetch(() => payrollService.list({ month, year }), [month, year]);
  const handleApprove = async (id) => {
    if (!confirm('Onayliyor musunuz?')) return;
    try { await payrollService.approve(id); refetch(); } catch (err) { alert(err.response?.data?.message || 'Hata'); }
  };
  const handleCancel = async (id) => {
    if (!confirm('İptal emin misiniz?')) return;
    try { await payrollService.cancel(id); refetch(); } catch (err) { alert(err.response?.data?.message || 'Hata'); }
  };

  const handleBulkExport = async () => {
    try {
      const token = localStorage.getItem('erp_access_token');
      const r = await fetch('/api/payroll/export/bulk?month=' + month + '&year=' + year, { headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) throw new Error('Hata');
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'bordro_toplu_' + month + '_' + year + '.csv';
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
    } catch (e) { alert('Export hatasi'); }
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bordro Listesi</h1>
        {isHR() && <button onClick={handleBulkExport} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2"><FiDownload className="h-4 w-4" />Toplu Excel</button>}
        {isHR() && <Link to="/payroll/run"><Button>Bordro Hesapla</Button></Link>}
      </div>
      <div className="flex gap-4">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg">
          {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}. Ay</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg">
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <Table headers={['Çalışan', 'Departman', 'Brut', 'Kesinti', 'Net', 'İşveren', 'Durum', 'İşlem']}>
        {(payrolls || []).map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.employee?.firstName} {p.employee?.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{p.employee?.department?.name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(p.totalGrossEarnings || p.grossSalary)}</td>
            <td className="px-6 py-4 text-sm text-red-600">{formatCurrency(p.totalDeductions)}</td>
            <td className="px-6 py-4 text-sm font-semibold text-green-700">{formatCurrency(p.netSalary)}</td>
            <td className="px-6 py-4 text-sm text-purple-700">{formatCurrency(p.totalEmployerCost || 0)}</td>
            <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
            <td className="px-6 py-4">
              <div className="flex gap-1">
                {p.status === 'CALCULATED' && (isHR() || isFinance()) && (
                  <button onClick={() => handleApprove(p.id)} className="text-green-600 hover:text-green-800 p-1" title="Onayla"><FiCheck className="h-4 w-4" /></button>
                )}
                {p.status !== 'PAID' && p.status !== 'CANCELLED' && isHR() && (
                  <button onClick={() => handleCancel(p.id)} className="text-red-600 hover:text-red-800 p-1" title="İptal"><FiXCircle className="h-4 w-4" /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}