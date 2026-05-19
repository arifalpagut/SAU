import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiGrid, FiBriefcase, FiUserMinus, FiFileText, FiAlertCircle, FiArrowRight, FiPlus, FiVolume2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import { employeeService } from '../../services/employeeService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import MetricCard from '../../components/common/MetricCard';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import api from '../../services/api';
import { useState, useEffect } from 'react';

const STATUS_TR = { PENDING: 'Bekleyen', APPROVED: 'Onayli', REJECTED: 'Reddedilen', CANCELLED: 'İptal' };

function SectionTitle({ title, action, to }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {action && to && <button onClick={() => navigate(to)} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium">{action} <FiArrowRight className="h-4 w-4" /></button>}
    </div>
  );
}

function AnnouncementBanner({ announcements }) {
  if (!announcements || announcements.length === 0) return null;
  const PRIO_COLORS = { URGENT: 'bg-red-50 border-red-200', HIGH: 'bg-orange-50 border-orange-200', NORMAL: 'bg-blue-50 border-blue-200', LOW: 'bg-gray-50 border-gray-200' };
  return (
    <div className="space-y-2">
      {announcements.slice(0, 3).map(a => (
        <div key={a.id} className={`rounded-xl border p-4 ${PRIO_COLORS[a.priority] || PRIO_COLORS.NORMAL}`}>
          <div className="flex items-start gap-2">
            <FiVolume2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
            <div><p className="text-sm font-semibold text-gray-900">{a.title}</p>
              {a.content && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{a.content}</p>}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const empId = user?.employeeId;
  const [leaveInfo, setLeaveInfo] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      empId ? api.get('/api/leaves/employee-info/' + empId).catch(() => ({ data: { data: null } })) : Promise.resolve({ data: { data: null } }),
      api.get('/api/announcements/active').catch(() => ({ data: { data: [] } }))
    ]).then(([l, a]) => { setLeaveInfo(l.data.data); setAnnouncements(a.data.data || []); }).finally(() => setLoading(false));
  }, [empId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {user?.employee?.firstName}!</h1><p className="text-sm text-gray-500 mt-1">Kişisel paneliniz</p></div>
      <AnnouncementBanner announcements={announcements} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div onClick={() => navigate('/leaves/request')} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5">
          <FiCalendar className="h-8 w-8 text-primary-600 mb-3" /><h3 className="text-sm font-semibold text-gray-900">İzin Talebi</h3><p className="text-xs text-gray-500 mt-1">Yeni izin talebi oluştur</p>
        </div>
        <div onClick={() => navigate('/leaves')} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5">
          <FiFileText className="h-8 w-8 text-green-600 mb-3" /><h3 className="text-sm font-semibold text-gray-900">İzinlerim</h3><p className="text-xs text-gray-500 mt-1">İzin geçmişini görüntüle</p>
        </div>
        <div onClick={() => navigate('/performance/goals')} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5">
          <FiTrendingUp className="h-8 w-8 text-orange-600 mb-3" /><h3 className="text-sm font-semibold text-gray-900">Performansim</h3><p className="text-xs text-gray-500 mt-1">Hedefler ve değerlendirme</p>
        </div>
      </div>
      {leaveInfo && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">İzin Bakiyem</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-primary-50 rounded-lg p-3 text-center"><p className="text-xs text-primary-600">Kıdem</p><p className="text-xl font-bold text-primary-800">{leaveInfo.entitlement?.seniority} yil</p></div>
            <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xs text-green-600">Yillik Hak</p><p className="text-xl font-bold text-green-800">{leaveInfo.entitlement?.days} gun</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {leaveInfo.balances?.map((b, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between mb-1"><span className="text-xs font-semibold text-gray-700">{b.leaveType}</span><span className="text-xs text-gray-400">{b.year}</span></div>
                <div className="flex justify-between text-xs"><span>Kullanilan: <strong>{b.usedDays}</strong></span><span>Kalan: <strong className="text-green-700">{b.remainingDays}</strong></span></div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2"><div className={`h-1.5 rounded-full ${b.totalDays > 0 && (b.usedDays / b.totalDays) > 0.8 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${b.totalDays > 0 ? Math.min((b.usedDays / b.totalDays) * 100, 100) : 0}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      employeeService.list({ limit: 50 }).catch(() => ({ data: { data: { items: [] } } })),
      api.get('/api/announcements/active').catch(() => ({ data: { data: [] } }))
    ]).then(([e, a]) => { setTeam(e.data.data?.items || []); setAnnouncements(a.data.data || []); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Yönetici Paneli</h1><p className="text-sm text-gray-500 mt-1">Ekip yönetim özeti</p></div>
      <AnnouncementBanner announcements={announcements} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard icon={FiUsers} title="Ekip Buyuklugu" value={team.length} color="bg-primary-600" to="/employees" />
        <MetricCard icon={FiCalendar} title="İzin Onaylari" value="Bekleyenler" color="bg-yellow-500" to="/leaves/approvals" />
        <MetricCard icon={FiTrendingUp} title="Performans" value="Değerlendirme" color="bg-orange-500" to="/performance/goals" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <SectionTitle title="Ekibim" action="Tumu" to="/employees" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.slice(0, 6).map(emp => (
            <div key={emp.id} onClick={() => navigate('/employees/' + emp.id)} className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                {emp.photo ? <img src={emp.photo} className="w-full h-full rounded-xl object-cover" /> : <span className="text-xs font-bold text-primary-700">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>}
              </div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{emp.firstName} {emp.lastName}</p><p className="text-xs text-gray-400">{emp.position?.title || '-'}</p></div>
              <StatusBadge status={emp.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { isHR } = usePermission();
  const noOp = () => Promise.resolve({ data: { data: null } });
  const { data: summary, loading } = useFetch(() => isHR() ? dashboardService.getSummary() : noOp(), []);
  const { data: leaveStats } = useFetch(() => isHR() ? dashboardService.getLeaveStats() : noOp(), []);
  const { data: deptDist } = useFetch(() => isHR() ? dashboardService.getDepartmentDistribution() : noOp(), []);
  const { data: payrollTrend } = useFetch(() => isHR() ? dashboardService.getPayrollTrend() : noOp(), []);
  const { data: recent } = useFetch(() => isHR() ? dashboardService.getRecentActivities() : noOp(), []);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => { api.get('/api/announcements/active').then(r => setAnnouncements(r.data.data || [])).catch(() => {}); }, []);

  if (loading) return <LoadingSpinner />;
  if (!summary) return <EmployeeDashboard />;

  const leaveChartData = leaveStats?.byStatus ? Object.entries(leaveStats.byStatus).map(([k, v]) => ({ name: STATUS_TR[k] || k, value: v })) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-sm text-gray-400 mt-1">Yönetim özet paneli</p></div>
        <p className="text-sm text-gray-400">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <AnnouncementBanner announcements={announcements} />
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Temel Göstergeler</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard icon={FiUsers} title="Toplam Çalışan" value={summary.totalEmployees} subtitle={`${summary.activeEmployees} aktif`} color="bg-primary-600" to="/employees" size="lg" />
          <MetricCard icon={FiGrid} title="Departman" value={summary.totalDepartments} color="bg-indigo-600" to="/departments" size="lg" />
          <MetricCard icon={FiBriefcase} title="Pozisyon" value={summary.totalPositions} color="bg-cyan-600" to="/positions" size="lg" />
          <MetricCard icon={FiCalendar} title="Bekleyen Izin" value={summary.pendingLeaves} subtitle={`${summary.thisMonthApproved} onayli`} color="bg-yellow-500" to="/leaves/approvals" size="lg" />
          <MetricCard icon={FiTrendingUp} title="Performans" value={`${summary.averagePerformance}/5`} color="bg-orange-500" to="/performance/evaluations" size="lg" />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Finansal Özet</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={FiFileText} title="Bu Ay Bordro" value={summary.thisMonthPayrolls} color="bg-purple-600" to="/payroll" />
          <MetricCard icon={FiDollarSign} title="Aylik Brut" value={formatCurrency(summary.totalMonthlyGross)} color="bg-blue-600" to="/payroll" />
          <MetricCard icon={FiDollarSign} title="Aylik Net" value={formatCurrency(summary.totalMonthlyNet)} color="bg-green-600" to="/payroll" />
          <MetricCard icon={FiDollarSign} title="İşveren Maliyeti" value={formatCurrency(summary.totalEmployerCost)} color="bg-red-500" to="/payroll/reports" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {leaveChartData.length > 0 && <PieChart data={leaveChartData} title="İzin Dağılımı" />}
        {deptDist && deptDist.length > 0 && <PieChart data={deptDist} title="Departman Dağılımı" />}
        {payrollTrend && payrollTrend.length > 0 && <BarChart data={payrollTrend} dataKey="brut" xKey="name" title="Bordro Trendi" color="#3b82f6" />}
      </div>
      {recent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <SectionTitle title="Son Çalışanlar" action="Tumu" to="/employees" />
            {recent.recentEmployees?.length > 0 ? recent.recentEmployees.map((e, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm"><span className="text-gray-900">{e.name}</span><span className="text-xs text-gray-400">{e.department}</span></div>
            )) : <p className="text-xs text-gray-400">Henuz veri yok</p>}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <SectionTitle title="Son İzinler" action="Tumu" to="/leaves" />
            {recent.recentLeaves?.length > 0 ? recent.recentLeaves.map((l, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm"><span className="text-gray-900">{l.employee}</span><StatusBadge status={l.status} /></div>
            )) : <p className="text-xs text-gray-400">Henuz veri yok</p>}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <SectionTitle title="Onay Bekleyenler" />
            {recent.pendingApprovals > 0 ? (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-600">{recent.pendingApprovals}</p><p className="text-sm text-red-500 mt-1">işlem bekliyor</p></div>
            ) : <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-sm text-green-700">Bekleyen onay yok</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === 'EMPLOYEE') return <EmployeeDashboard />;
  if (user?.role === 'MANAGER') return <ManagerDashboard />;
  return <AdminDashboard />;
}