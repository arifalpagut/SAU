import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PieChart from '../../components/charts/PieChart';

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isHR } = usePermission();
  const { data: summary, loading } = useFetch(() => isHR() ? dashboardService.getSummary() : Promise.resolve({ data: { data: null } }), []);
  const { data: leaveStats } = useFetch(() => isHR() ? dashboardService.getLeaveStats() : Promise.resolve({ data: { data: null } }), []);

  if (loading) return <LoadingSpinner />;

  if (!summary) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hoş Geldiniz!</h1>
        <p className="text-gray-500">ERP İnsan Kaynakları Yönetim Sistemi</p>
      </div>
    );
  }

  const leaveChartData = leaveStats?.byStatus
    ? Object.entries(leaveStats.byStatus).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FiUsers} title="Toplam Çalışan" value={summary.totalEmployees} color="bg-primary-600" />
        <StatCard icon={FiUsers} title="Aktif Çalışan" value={summary.activeEmployees} color="bg-green-600" />
        <StatCard icon={FiCalendar} title="Bekleyen İzin" value={summary.pendingLeaves} color="bg-yellow-500" />
        <StatCard icon={FiDollarSign} title="Toplam Maaş" value={formatCurrency(summary.totalPayrollCost)} color="bg-purple-600" />
      </div>
      {leaveChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChart data={leaveChartData} title="İzin Durumu Dağılımı" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Performans Ortalaması</h3>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-6xl font-bold text-primary-600">{summary.averagePerformance || 0}</p>
                <p className="text-gray-500 mt-2">/ 5.0 puan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
