import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { FiUsers, FiUserCheck, FiUserMinus } from 'react-icons/fi';
import api from '../../services/api';

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}><Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} /></div>
        <div><p className="text-xs text-gray-500 dark:text-gray-400">{title}</p><p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p></div>
      </div>
    </div>
  );
}

export default function EmployeeReportPage() {
  const { data: summary, loading } = useFetch(() => dashboardService.getSummary(), []);
  const { data: deptDist } = useFetch(() => dashboardService.getDepartmentDistribution(), []);
  const { data: statusDist } = useFetch(() => dashboardService.getEmployeeStatusDistribution(), []);

  if (loading) return <LoadingSpinner />;

  const STATUS_TR = { ACTIVE: 'Aktif', INACTIVE: 'Pasif', ON_LEAVE: 'İzinli', TERMINATED: 'Ayrılmış' };
  const statusData = statusDist ? statusDist.map(s => ({ name: STATUS_TR[s.name] || s.name, value: s.value })) : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personel Raporu</h1><p className="text-sm text-gray-500 mt-1">Çalışan dagilim analizi</p></div>
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={FiUsers} title="Toplam" value={summary.totalEmployees} color="bg-primary-600" />
          <StatCard icon={FiUserCheck} title="Aktif" value={summary.activeEmployees} color="bg-green-600" />
          <StatCard icon={FiUserMinus} title="Pasif" value={summary.passiveEmployees || 0} color="bg-gray-500" />
          <StatCard icon={FiUsers} title="Departman" value={summary.totalDepartments} color="bg-indigo-600" />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deptDist && deptDist.length > 0 && <PieChart data={deptDist} title="Departman Bazli Çalışan Dağılımı" />}
        {statusData.length > 0 && <PieChart data={statusData} title="Çalışan Statu Dağılımı" />}
      </div>
    </div>
  );
}