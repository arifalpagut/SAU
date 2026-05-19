import { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiCalendar, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function LeaveReportPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [deptFilter, setDeptFilter] = useState('');
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [exporting, setExporting] = useState(false);
  const { data: report, loading } = useFetch(
    () => api.get('/api/reports/leave-summary', { params: { year, departmentId: deptFilter || undefined, search: search || undefined } }),
    [year, deptFilter, search]
  );

  useEffect(() => { api.get('/api/departments').then(r => setDepartments(r.data.data || [])); }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      params.append('year', year);
      if (deptFilter) params.append('departmentId', deptFilter);
      const token = localStorage.getItem('erp_access_token');
      const response = await fetch('/api/reports/leave-summary/export?' + params.toString(), { headers: { Authorization: 'Bearer ' + token } });
      if (!response.ok) throw new Error('Export hatasi');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'izin_raporu_' + year + '.csv';
      document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); a.remove();
    } catch (e) { alert('Export hatasi'); }
    finally { setExporting(false); }
  };

  if (loading) return <LoadingSpinner />;
  const summary = report?.summary || {};
  const employees = report?.employees || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yillik İzin Raporu</h1>
          <p className="text-sm text-gray-500 mt-1">{summary.year || year} yili izin özeti</p>
        </div>
        <Button variant="outline" onClick={handleExport} loading={exporting}>
          <FiDownload className="mr-2 h-4 w-4" />Excel
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} title="Toplam Çalışan" value={summary.totalEmployees || 0} color="bg-primary-600" />
        <StatCard icon={FiCalendar} title="Hak Edilen" value={`${summary.totalEntitled || 0} gun`} color="bg-blue-600" />
        <StatCard icon={FiCheckCircle} title="Kullanilan" value={`${summary.totalUsed || 0} gun`} color="bg-yellow-500" />
        <StatCard icon={FiAlertCircle} title="Kalan" value={`${summary.totalRemaining || 0} gun`} color="bg-green-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Tum Departmanlar</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input type="text" placeholder="Çalışan ara..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Çalışan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Departman</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Kıdem</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Yas</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hak</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Kullanilan</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Kalan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kural</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Kullanim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Kayıt bulunamadi</td></tr>
            ) : employees.map((emp) => {
              const pct = emp.annualEntitlement > 0 ? Math.round((emp.totalUsed / emp.annualEntitlement) * 100) : 0;
              const bar = pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-green-500';
              const rc = emp.totalRemaining <= 3 ? 'text-red-600 font-bold' : emp.totalRemaining <= 7 ? 'text-yellow-600 font-semibold' : 'text-green-700 font-semibold';
              return (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div><div className="text-xs text-gray-400">{emp.employeeNo}</div></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{emp.department}</td>
                  <td className="px-4 py-3 text-sm text-center">{emp.seniority} yil</td>
                  <td className="px-4 py-3 text-sm text-center">{emp.age}</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-blue-700">{emp.annualEntitlement}</td>
                  <td className="px-4 py-3 text-sm text-center">{emp.totalUsed}</td>
                  <td className={`px-4 py-3 text-sm text-center ${rc}`}>{emp.totalRemaining}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{emp.rule}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[60px]">
                        <div className={`h-2 rounded-full ${bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
