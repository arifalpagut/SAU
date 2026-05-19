import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { employeeService } from '../../services/employeeService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

export default function EmployeeListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { isHR } = usePermission();
  const { data, loading, refetch } = useFetch(() => employeeService.list({ page, limit: 10, search }), [page, search]);

  if (loading) return <LoadingSpinner />;

  const employees = data?.items || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personel Listesi</h1>
        {isHR() && (
          <Link to="/employees/new">
            <Button><FiPlus className="mr-2 h-4 w-4" />Yeni Çalışan</Button>
          </Link>
        )}
      </div>
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Ad, soyad veya e-posta ara..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      <Table headers={['Ad Soyad', 'E-posta', 'Departman', 'Pozisyon', 'Durum', 'İşlem']}>
        {employees.map((emp) => (
          <tr key={emp.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{emp.email}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{emp.department?.name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{emp.position?.title || '-'}</td>
            <td className="px-6 py-4"><StatusBadge status={emp.status} /></td>
            <td className="px-6 py-4">
              <Link to={`/employees/${emp.id}`} className="text-primary-600 hover:text-primary-800"><FiEye className="h-4 w-4" /></Link>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
