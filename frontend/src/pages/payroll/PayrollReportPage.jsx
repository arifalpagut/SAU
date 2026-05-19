import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { payrollService } from '../../services/payrollService';
import { formatCurrency } from '../../utils/formatCurrency';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PayrollReportPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const { data: report, loading } = useFetch(() => payrollService.getCostReport({ year }), [year]);

  if (loading) return <LoadingSpinner />;

  const departments = report?.departments ? Object.values(report.departments) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Maaş Maliyet Raporu</h1>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg">
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {report?.company && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
            <p className="text-sm text-gray-500">Toplam Brüt</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(report.company.grossTotal)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
            <p className="text-sm text-gray-500">Toplam Net</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(report.company.netTotal)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
            <p className="text-sm text-gray-500">Toplam Kesinti</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(report.company.deductionTotal)}</p>
          </div>
        </div>
      )}
      <Table headers={['Departman', 'Çalışan', 'Brüt Toplam', 'Net Toplam', 'Kesinti Toplam']}>
        {departments.map((d, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.department}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{d.employeeCount}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(d.grossTotal)}</td>
            <td className="px-6 py-4 text-sm text-green-700">{formatCurrency(d.netTotal)}</td>
            <td className="px-6 py-4 text-sm text-red-600">{formatCurrency(d.deductionTotal)}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
