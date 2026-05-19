import { useState } from 'react';
import { payrollService } from '../../services/payrollService';
import Button from '../../components/common/Button';

export default function PayrollRunPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRun = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await payrollService.run(month, year);
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bordro Hesapla</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ay</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}. Ay</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={handleRun} loading={loading} className="w-full">Bordro Çalıştır</Button>
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">{result.length} çalışan için bordro hesaplandı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
