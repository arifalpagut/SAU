import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { employeeService } from '../../services/employeeService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLE_LABELS } from '../../utils/roleGuard';

function InfoRow({ label, value }) {
  return (
    <div className="py-3 grid grid-cols-3 gap-4 border-b border-gray-100">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 col-span-2">{value || '-'}</dd>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const { data: emp, loading } = useFetch(() => employeeService.getById(id), [id]);

  if (loading) return <LoadingSpinner />;
  if (!emp) return <p className="text-center py-12 text-gray-500">Çalışan bulunamadı</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{emp.firstName} {emp.lastName}</h1>
        <StatusBadge status={emp.status} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kişisel Bilgiler</h2>
        <dl>
          <InfoRow label="TC Kimlik No" value={emp.nationalId} />
          <InfoRow label="E-posta" value={emp.email} />
          <InfoRow label="Telefon" value={emp.phone} />
          <InfoRow label="Doğum Tarihi" value={formatDate(emp.dateOfBirth)} />
        </dl>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">İş Bilgileri</h2>
        <dl>
          <InfoRow label="Departman" value={emp.department?.name} />
          <InfoRow label="Pozisyon" value={emp.position?.title} />
          <InfoRow label="Yönetici" value={emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : '-'} />
          <InfoRow label="İşe Giriş Tarihi" value={formatDate(emp.hireDate)} />
          <InfoRow label="Brüt Maaş" value={formatCurrency(emp.grossSalary)} />
          <InfoRow label="Rol" value={ROLE_LABELS[emp.user?.role] || '-'} />
        </dl>
      </div>
    </div>
  );
}
