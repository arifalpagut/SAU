import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { payrollService } from '../../services/payrollService';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';

export default function PayrollListPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { data: payrolls, loading } = useFetch(() => payrollService.list({ month, year }), [month, year]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bordro Listesi</h1>
      <div className="flex gap-4">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg">
          {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}. Ay</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg">
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <Table headers={['Çalışan', 'Departman', 'Brüt Maaş', 'Kesintiler', 'Net Maaş', 'Durum']}>
        {(payrolls || []).map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.employee?.firstName} {p.employee?.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{p.employee?.department?.name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(p.grossSalary)}</td>
            <td className="px-6 py-4 text-sm text-red-600">{formatCurrency(p.totalDeductions)}</td>
            <td className="px-6 py-4 text-sm font-semibold text-green-700">{formatCurrency(p.netSalary)}</td>
            <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
