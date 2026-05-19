import { useState, useEffect, useRef } from 'react';
import { payrollService } from '../../services/payrollService';
import { employeeService } from '../../services/employeeService';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { FiChevronDown, FiUsers, FiUser } from 'react-icons/fi';

function MultiSelect({ label, options, selected, onChange, labelKey = 'name', valueKey = 'id' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const toggle = (val) => { if (selected.includes(val)) onChange(selected.filter(v => v !== val)); else onChange([...selected, val]); };
  const selectAll = () => { if (selected.length === options.length) onChange([]); else onChange(options.map(o => o[valueKey])); };
  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center justify-between w-full min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">
        <span className="truncate">{selected.length === 0 || selected.length === options.length ? 'Tümü (' + options.length + ')' : selected.length + ' seçili'}</span>
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

function ResultTable({ result }) {
  if (!result) return null;
  const Row = ({ label, value, color }) => value > 0 ? (
    <div className="flex justify-between text-sm py-1 border-b border-gray-50">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${color || 'text-gray-900'}`}>{formatCurrency(value)}</span>
    </div>
  ) : null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <h3 className="text-lg font-bold text-gray-900">Hesaplama Sonucu</h3>
      <div>
        <h4 className="text-sm font-semibold text-green-700 mb-2 uppercase">Gelirler</h4>
        <Row label="Brüt Maaş" value={result.grossSalary} />
        <Row label="Ek Ödeme" value={result.bonusPayment} />
        <Row label="Fazla Mesai" value={result.overtimePayment} />
        <Row label="Yol Yardımı" value={result.transportationAllowance} />
        <Row label="Yemek Yardımı" value={result.mealAllowance} />
        <Row label="Diğer" value={result.otherEarnings} />
        <div className="flex justify-between text-sm py-2 bg-green-50 px-2 rounded font-semibold mt-1">
          <span className="text-green-800">Toplam Brüt</span><span className="text-green-800">{formatCurrency(result.totalGrossEarnings)}</span>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-red-700 mb-2 uppercase">Kesintiler</h4>
        <div className="flex justify-between text-xs py-1 text-gray-400 italic"><span>GV Matrahı</span><span>{formatCurrency(result.incomeTaxBase)}</span></div>
        <Row label="SGK İşçi" value={result.employeeSgkPremium} color="text-red-600" />
        <Row label="İşsizlik İşçi" value={result.employeeUnemploymentPremium} color="text-red-600" />
        <Row label="Gelir Vergisi" value={result.incomeTax} color="text-red-600" />
        <Row label="Damga Vergisi" value={result.stampTax} color="text-red-600" />
        <Row label="BES" value={result.besDeduction} color="text-orange-600" />
        <Row label="Avans" value={result.advanceDeduction} color="text-orange-600" />
        <Row label="İcra" value={result.enforcementDeduction} color="text-orange-600" />
        <Row label="Diğer" value={result.otherDeductions} color="text-orange-600" />
      </div>
      <div className="flex justify-between text-sm py-2 bg-red-50 px-2 rounded font-semibold">
        <span className="text-red-800">Toplam Kesinti</span><span className="text-red-800">-{formatCurrency(result.totalDeductions)}</span>
      </div>
      <div className="flex justify-between py-3 bg-primary-50 px-3 rounded-lg">
        <span className="text-lg font-bold text-primary-800">Net Maaş</span><span className="text-lg font-bold text-primary-800">{formatCurrency(result.netSalary)}</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-purple-700 mb-2 uppercase">İşveren Maliyeti</h4>
        <Row label="SGK İşveren" value={result.employerSgkPremium} color="text-purple-700" />
        <Row label="İşsizlik İşveren" value={result.employerUnemploymentPremium} color="text-purple-700" />
        <div className="flex justify-between text-sm py-2 bg-purple-50 px-2 rounded font-semibold mt-1">
          <span className="text-purple-800">Toplam İşveren</span><span className="text-purple-800">{formatCurrency(result.totalEmployerCost)}</span>
        </div>
      </div>
    </div>
  );
}

export default function PayrollRunPage() {
  const now = new Date();
  const [mode, setMode] = useState('bulk');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deptFilter, setDeptFilter] = useState('');
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [bulkMonth, setBulkMonth] = useState(now.getMonth() + 1);
  const [bulkYear, setBulkYear] = useState(now.getFullYear());
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState('');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    employeeId: '', month: now.getMonth() + 1, year: now.getFullYear(), grossSalary: '',
    bonusPayment: 0, overtimePayment: 0, transportationAllowance: 0, mealAllowance: 0,
    otherEarnings: 0, besDeduction: 0, advanceDeduction: 0, enforcementDeduction: 0, otherDeductions: 0
  });

  useEffect(() => {
    api.get('/api/departments').then(r => setDepartments(r.data.data || []));
    employeeService.list({ limit: 100 }).then(r => setEmployees(r.data.data?.items || []));
  }, []);

  const filteredEmployees = deptFilter ? employees.filter(e => e.departmentId === deptFilter || e.department_id === deptFilter) : employees;
  const empOptions = filteredEmployees.map(e => ({ id: e.id, name: e.firstName + ' ' + e.lastName + ' (' + (e.department?.name || '') + ')' }));

  const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setResult(null); setSaved(false); };
  const handleEmployeeSelect = (e) => {
    const emp = employees.find(em => em.id === e.target.value);
    setForm(prev => ({ ...prev, employeeId: e.target.value, grossSalary: emp ? emp.grossSalary : '' }));
    setResult(null); setSaved(false);
  };

  const handleCalculate = async () => {
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try { const { data } = await payrollService.calculate(form); setResult(data.data); }
    catch (err) { setError(err.response?.data?.message || 'Hata'); }
    finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setLoading(true); setError('');
    try { await payrollService.generate(form); setSaved(true); }
    catch (err) { setError(err.response?.data?.message || 'Hata'); }
    finally { setLoading(false); }
  };

  const handleBulkRun = async () => {
    setLoading(true); setBulkError(''); setBulkResult(null);
    try {
      const { data } = await payrollService.run(bulkMonth, bulkYear);
      setBulkResult(data.data);
    } catch (err) { setBulkError(err.response?.data?.message || 'Hata'); }
    finally { setLoading(false); }
  };

  const handleExportResult = () => {
    if (!result) return;
    const BOM = '\xEF\xBB\xBF';
    const L = [];
    L.push('BORDRO HESAPLAMA;Tutar');
    L.push('Brüt Maaş;' + Number(result.grossSalary||0).toFixed(2));
    L.push('Ek Ödeme;' + Number(result.bonusPayment||0).toFixed(2));
    L.push('Fazla Mesai;' + Number(result.overtimePayment||0).toFixed(2));
    L.push('Yol Yardımı;' + Number(result.transportationAllowance||0).toFixed(2));
    L.push('Yemek Yardımı;' + Number(result.mealAllowance||0).toFixed(2));
    L.push('Diğer;' + Number(result.otherEarnings||0).toFixed(2));
    L.push('TOPLAM BRÜT;' + Number(result.totalGrossEarnings||0).toFixed(2));
    L.push('');
    L.push('SGK İşçi;' + Number(result.employeeSgkPremium||0).toFixed(2));
    L.push('İşsizlik İşçi;' + Number(result.employeeUnemploymentPremium||0).toFixed(2));
    L.push('Gelir Vergisi;' + Number(result.incomeTax||0).toFixed(2));
    L.push('Damga Vergisi;' + Number(result.stampTax||0).toFixed(2));
    L.push('BES;' + Number(result.besDeduction||0).toFixed(2));
    L.push('Avans;' + Number(result.advanceDeduction||0).toFixed(2));
    L.push('İcra;' + Number(result.enforcementDeduction||0).toFixed(2));
    L.push('Diğer Kesinti;' + Number(result.otherDeductions||0).toFixed(2));
    L.push('TOPLAM KESİNTİ;' + Number(result.totalDeductions||0).toFixed(2));
    L.push('NET MAAŞ;' + Number(result.netSalary||0).toFixed(2));
    L.push('');
    L.push('SGK İşveren;' + Number(result.employerSgkPremium||0).toFixed(2));
    L.push('İşsizlik İşveren;' + Number(result.employerUnemploymentPremium||0).toFixed(2));
    L.push('TOPLAM İŞVEREN;' + Number(result.totalEmployerCost||0).toFixed(2));
    const csv = BOM + L.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bordro_hesaplama.csv';
    document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bordro Hesaplama</h1>

      <div className="flex gap-2">
        <button onClick={() => setMode('bulk')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'bulk' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>
          <FiUsers className="h-4 w-4" />Toplu Hesaplama
        </button>
        <button onClick={() => setMode('single')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'single' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>
          <FiUser className="h-4 w-4" />Tekli Hesaplama
        </button>
      </div>

      {mode === 'bulk' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Toplu Bordro Hesaplama</h2>
          <p className="text-sm text-gray-500">Seçili dönem için tüm aktif çalışanların bordrosunu hesaplar.</p>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ay</label>
              <select value={bulkMonth} onChange={(e) => setBulkMonth(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}. Ay</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Yıl</label>
              <select value={bulkYear} onChange={(e) => setBulkYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Departman Filtre</label>
              <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setSelectedEmps([]); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Tüm Departmanlar</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <Button onClick={handleBulkRun} loading={loading} className="!py-2">
              <FiUsers className="mr-2 h-4 w-4" />Toplu Hesapla ({filteredEmployees.length} kişi)
            </Button>
          </div>
          {bulkError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{bulkError}</div>}
          {bulkResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 font-semibold">{bulkResult.length} çalışan için bordro hesaplandı.</p>
              <p className="text-xs text-green-600 mt-1">Dönem: {bulkMonth}/{bulkYear}</p>
            </div>
          )}
        </div>
      )}

      {mode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Tekli Bordro Hesaplama</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Çalışan</label>
              <select name="employeeId" value={form.employeeId} onChange={handleEmployeeSelect} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Seçiniz</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.department?.name || ''})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Ay</label><select name="month" value={form.month} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}. Ay</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label><select name="year" value={form.year} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">{[2024,2025,2026].map(y=><option key={y} value={y}>{y}</option>)}</select></div>
            </div>
            <div className="border-t pt-4"><h3 className="text-sm font-semibold text-green-700 mb-3">Gelir Kalemleri</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Brüt Maaş" name="grossSalary" type="number" value={form.grossSalary} onChange={handleChange} />
                <Input label="Ek Ödeme" name="bonusPayment" type="number" value={form.bonusPayment} onChange={handleChange} />
                <Input label="Fazla Mesai" name="overtimePayment" type="number" value={form.overtimePayment} onChange={handleChange} />
                <Input label="Yol Yardımı" name="transportationAllowance" type="number" value={form.transportationAllowance} onChange={handleChange} />
                <Input label="Yemek Yardımı" name="mealAllowance" type="number" value={form.mealAllowance} onChange={handleChange} />
                <Input label="Diğer" name="otherEarnings" type="number" value={form.otherEarnings} onChange={handleChange} />
              </div>
            </div>
            <div className="border-t pt-4"><h3 className="text-sm font-semibold text-red-700 mb-3">Kesinti Kalemleri</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input label="BES" name="besDeduction" type="number" value={form.besDeduction} onChange={handleChange} />
                <Input label="Avans" name="advanceDeduction" type="number" value={form.advanceDeduction} onChange={handleChange} />
                <Input label="İcra" name="enforcementDeduction" type="number" value={form.enforcementDeduction} onChange={handleChange} />
                <Input label="Diğer" name="otherDeductions" type="number" value={form.otherDeductions} onChange={handleChange} />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleCalculate} loading={loading} className="flex-1">Hesapla</Button>
              {result && !saved && <Button variant="success" onClick={handleGenerate} loading={loading} className="flex-1">Bordro Oluştur</Button>}
            </div>
            {result && <button onClick={handleExportResult} className="w-full mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700">📥 Excel Export</button>}
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">Bordro kaydedildi!</div>}
          </div>
          <div>{result ? <ResultTable result={result} /> : <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"><p className="text-gray-400">Çalışan seçin ve Hesapla tıklayın</p></div>}</div>
        </div>
      )}
    </div>
  );
}