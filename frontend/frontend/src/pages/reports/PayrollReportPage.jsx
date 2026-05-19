import { useState, useEffect, useRef } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { payrollService } from '../../services/payrollService';
import { dashboardService } from '../../services/dashboardService';
import { employeeService } from '../../services/employeeService';
import { formatCurrency } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BarChart from '../../components/charts/BarChart';
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import api from '../../services/api';

function MultiSelect({ label, options, selected, onChange, labelKey = 'name', valueKey = 'id' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };

  const selectAll = () => {
    if (selected.length === options.length) onChange([]);
    else onChange(options.map(o => o[valueKey]));
  };

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">
        <span className="truncate">
          {selected.length === 0 ? 'Tümü' : selected.length === options.length ? 'Tümü' : selected.length + ' seçili'}
        </span>
        <FiChevronDown className={`h-4 w-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="px-3 py-2 border-b border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selected.length === options.length || selected.length === 0} onChange={selectAll} className="rounded" />
              <span className="text-xs font-semibold text-gray-700">Tümünü Seç</span>
            </label>
          </div>
          {options.map(opt => (
            <div key={opt[valueKey]} className="px-3 py-1.5 hover:bg-gray-50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.includes(opt[valueKey])} onChange={() => toggle(opt[valueKey])} className="rounded" />
                <span className="text-sm text-gray-700">{opt[labelKey]}</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PayrollReportPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [exportMonth, setExportMonth] = useState(0);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { data: report, loading } = useFetch(() => payrollService.getCostReport({ year }), [year]);
  const { data: trend } = useFetch(() => dashboardService.getPayrollTrend(), []);

  useEffect(() => {
    api.get('/api/departments').then(r => setDepartments(r.data.data || []));
    employeeService.list({ limit: 100 }).then(r => {
      const items = r.data.data?.items || [];
      setEmployees(items.map(e => ({ id: e.id, name: e.firstName + ' ' + e.lastName + (e.employeeNo ? ' (' + e.employeeNo + ')' : '') })));
    });
  }, []);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      params.append('year', year);
      if (exportMonth > 0) params.append('month', exportMonth);
      if (selectedEmps.length > 0 && selectedEmps.length < employees.length) params.append('employeeId', selectedEmps.join(','));
      const token = localStorage.getItem('erp_access_token');
      const r = await fetch('/api/payroll/export/bulk?' + params.toString(), { headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) throw new Error('Export hatası');
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'bordro_rapor_' + year + (exportMonth > 0 ? '_' + exportMonth + '_ay' : '') + '.csv';
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
    } catch (e) { alert('Export sırasında hata oluştu'); }
  };

  if (loading) return <LoadingSpinner />;
  const allDepts = report?.departments ? Object.values(report.departments) : [];
  const filteredDepts = selectedDepts.length > 0
    ? allDepts.filter(d => selectedDepts.some(id => { const dept = departments.find(dd => dd.id === id); return dept && dept.name === d.department; }))
    : allDepts;
  const deptChart = filteredDepts.map(d => ({ name: d.department, brut: Math.round(d.grossTotal), net: Math.round(d.netTotal) }));

  const totalGross = filteredDepts.reduce((a, d) => a + d.grossTotal, 0);
  const totalNet = filteredDepts.reduce((a, d) => a + d.netTotal, 0);
  const totalDed = filteredDepts.reduce((a, d) => a + d.deductionTotal, 0);
  const totalEmp = filteredDepts.reduce((a, d) => a + (d.employerCostTotal || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bordro Maliyet Raporu</h1>
          <p className="text-sm text-gray-500 mt-1">{year} yılı bordro analizi</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filtre ve Export</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Yıl</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ay (Export)</label>
            <select value={exportMonth} onChange={(e) => setExportMonth(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value={0}>Tüm Yıl</option>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}. Ay</option>)}
            </select>
          </div>
          <MultiSelect label="Departman" options={departments} selected={selectedDepts} onChange={setSelectedDepts} labelKey="name" valueKey="id" />
          <MultiSelect label="Personel (Export)" options={employees} selected={selectedEmps} onChange={setSelectedEmps} labelKey="name" valueKey="id" />
          <button onClick={handleExport} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <FiDownload className="h-4 w-4" />Excel Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-5">
          <p className="text-xs text-gray-500">Toplam Brüt</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalGross)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-5">
          <p className="text-xs text-gray-500">Toplam Net</p>
          <p className="text-xl font-bold text-green-700">{formatCurrency(totalNet)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-5">
          <p className="text-xs text-gray-500">Toplam Kesinti</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalDed)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-5">
          <p className="text-xs text-gray-500">İşveren Maliyeti</p>
          <p className="text-xl font-bold text-purple-700">{formatCurrency(totalEmp)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deptChart.length > 0 && <BarChart data={deptChart} dataKey="brut" xKey="name" title="Departman Bazlı Brüt Maaş" color="#3b82f6" />}
        {trend && trend.length > 0 && <BarChart data={trend} dataKey="brut" xKey="name" title="Aylık Bordro Trendi" color="#10b981" />}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Departman</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Çalışan</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Brüt</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Net</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Kesinti</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">İşveren</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDepts.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.department}</td>
                <td className="px-6 py-4 text-sm text-center text-gray-500">{d.employeeCount}</td>
                <td className="px-6 py-4 text-sm text-right">{formatCurrency(d.grossTotal)}</td>
                <td className="px-6 py-4 text-sm text-right text-green-700">{formatCurrency(d.netTotal)}</td>
                <td className="px-6 py-4 text-sm text-right text-red-600">{formatCurrency(d.deductionTotal)}</td>
                <td className="px-6 py-4 text-sm text-right text-purple-700">{formatCurrency(d.employerCostTotal || 0)}</td>
              </tr>
            ))}
            {filteredDepts.length > 1 && (
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4 text-sm">TOPLAM</td>
                <td className="px-6 py-4 text-sm text-center">{filteredDepts.reduce((a, d) => a + d.employeeCount, 0)}</td>
                <td className="px-6 py-4 text-sm text-right">{formatCurrency(totalGross)}</td>
                <td className="px-6 py-4 text-sm text-right text-green-700">{formatCurrency(totalNet)}</td>
                <td className="px-6 py-4 text-sm text-right text-red-600">{formatCurrency(totalDed)}</td>
                <td className="px-6 py-4 text-sm text-right text-purple-700">{formatCurrency(totalEmp)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}