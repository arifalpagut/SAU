import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiDownload } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { employeeService } from '../../services/employeeService';
import api from '../../services/api';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const WORK_TYPE_LABELS = { FULL_TIME: 'Tam Zamanli', PART_TIME: 'Yari Zamanli', INTERN: 'Stajyer', CONTRACT: 'Sözleşmeli' };

export default function EmployeeListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [exporting, setExporting] = useState(false);
  const { isHR } = usePermission();
  const { data, loading } = useFetch(
    () => employeeService.list({ page, limit: 10, search, status: statusFilter || undefined, departmentId: deptFilter || undefined, workType: workTypeFilter || undefined }),
    [page, search, statusFilter, deptFilter, workTypeFilter]
  );

  useEffect(() => { api.get('/api/departments').then(r => setDepartments(r.data.data || [])); }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (deptFilter) params.append('departmentId', deptFilter);
      if (workTypeFilter) params.append('workType', workTypeFilter);
      const token = localStorage.getItem('erp_access_token');
      const response = await fetch('/api/employees/export/excel?' + params.toString(), { headers: { Authorization: 'Bearer ' + token } });
      if (!response.ok) throw new Error('Export hatasi');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'personel_listesi_' + new Date().toISOString().split('T')[0] + '.csv';
      document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); a.remove();
    } catch (err) { alert('Export sirasinda hata olustu'); }
    finally { setExporting(false); }
  };

  if (loading) return <LoadingSpinner />;
  const employees = data?.items || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Personel Listesi</h1><p className="text-sm text-gray-500 mt-1">{pagination.total || 0} çalışan kayıtli</p></div>
        <div className="flex gap-3">{isHR() && <Button variant="outline" onClick={handleExport} loading={exporting}><FiDownload className="mr-2 h-4 w-4" />Excel</Button>}{isHR() && <Link to="/employees/new"><Button><FiPlus className="mr-2 h-4 w-4" />Yeni Çalışan</Button></Link>}</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="Ad, soyad, e-posta, TC kimlik, personel no..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Tum Durumlar</option><option value="ACTIVE">Aktif</option><option value="INACTIVE">Pasif</option><option value="ON_LEAVE">İzinli</option><option value="TERMINATED">Ayrılmış</option></select>
          <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Tum Departmanlar</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <select value={workTypeFilter} onChange={(e) => { setWorkTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Tum Çalışma Tipleri</option><option value="FULL_TIME">Tam Zamanli</option><option value="PART_TIME">Yari Zamanli</option><option value="INTERN">Stajyer</option><option value="CONTRACT">Sözleşmeli</option></select>
        </div>
      </div>

      <Table headers={['', 'Personel No', 'Ad Soyad', 'Departman', 'Pozisyon', 'Çalışma Tipi', 'Durum', 'İşlem']}>
        {employees.map((emp) => (
          <tr key={emp.id} className="hover:bg-gray-50">
            <td className="px-6 py-4"><div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">{emp.photo ? <img src={emp.photo} alt={`${emp.firstName} ${emp.lastName}`} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-primary-600">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>}</div></td>
            <td className="px-6 py-4 text-sm text-primary-600 font-mono">{emp.employeeNo || '-'}</td>
            <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div><div className="text-xs text-gray-400">{emp.email}</div></td>
            <td className="px-6 py-4 text-sm text-gray-500">{emp.department?.name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{emp.position?.title || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{WORK_TYPE_LABELS[emp.workType] || emp.workType || '-'}</td>
            <td className="px-6 py-4"><StatusBadge status={emp.status} /></td>
            <td className="px-6 py-4"><Link to={`/employees/${emp.id}`} className="text-primary-600 hover:text-primary-800"><FiEye className="h-4 w-4" /></Link></td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}