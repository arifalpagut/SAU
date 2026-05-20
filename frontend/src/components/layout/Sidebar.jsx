import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiTarget, FiGrid, FiLayers, FiCheckSquare, FiBriefcase, FiFileText, FiBarChart2 } from 'react-icons/fi';
import { usePermission } from '../../hooks/usePermission';

const menuGroups = [
  { label: null, items: [{ to: '/', icon: FiHome, label: 'Dashboard', roles: null }] },
  { label: 'Organizasyon', items: [
    { to: '/employees', icon: FiUsers, label: 'Personel', roles: ['ADMIN','HR_MANAGER','MANAGER'] },
    { to: '/departments', icon: FiGrid, label: 'Departmanlar', roles: ['ADMIN','HR_MANAGER'] },
    { to: '/positions', icon: FiBriefcase, label: 'Pozisyonlar', roles: ['ADMIN','HR_MANAGER'] },
    { to: '/organization', icon: FiUsers, label: 'Org. Şeması', roles: null }
  ]},
  { label: 'Operasyon', items: [
    { to: '/leaves', icon: FiCalendar, label: 'İzinler', roles: null },
    { to: '/leaves/approvals', icon: FiCheckSquare, label: 'İzin Onaylari', roles: ['ADMIN','HR_MANAGER','MANAGER'] },
    { to: '/performance/goals', icon: FiTarget, label: 'Performans', roles: null }
  ]},
  { label: 'Finans', items: [
    { to: '/payroll', icon: FiDollarSign, label: 'Bordro', roles: ['ADMIN','HR_MANAGER','FINANCE'] }
  ]},
  { label: 'Raporlar', items: [
    { to: '/reports/leaves', icon: FiBarChart2, label: 'İzin Raporu', roles: ['ADMIN','HR_MANAGER'] },
    { to: '/reports/payroll', icon: FiBarChart2, label: 'Bordro Raporu', roles: ['ADMIN','HR_MANAGER','FINANCE'] },
    { to: '/reports/employees', icon: FiBarChart2, label: 'Personel Raporu', roles: ['ADMIN','HR_MANAGER'] }
  ]},
  { label: 'Yönetim', items: [
    { to: '/performance/periods', icon: FiLayers, label: 'Dönemler', roles: ['ADMIN','HR_MANAGER'] },
    { to: '/announcements', icon: FiFileText, label: 'Duyurular', roles: ['ADMIN','HR_MANAGER'] },
    { to: '/parameters', icon: FiFileText, label: 'Parametreler', roles: ['ADMIN','HR_MANAGER'] },
    { to: '/audit-logs', icon: FiFileText, label: 'Audit Log', roles: ['ADMIN','HR_MANAGER'] }
  ]}
];

export default function Sidebar({ onClose }) {
  const { hasRole } = usePermission();
  return (
    <aside className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 min-h-screen">
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-100 dark:border-gray-700">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">HR</span>
        </div>
        <div><span className="font-bold text-gray-900 dark:text-white text-sm">ERP HR</span><p className="text-xs text-gray-400 -mt-0.5">Yönetim Paneli</p></div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuGroups.map((group, gi) => {
          const vis = group.items.filter(i => i.roles === null || hasRole(...i.roles));
          if (vis.length === 0) return null;
          return (
            <div key={gi} className={gi > 0 ? 'pt-4' : ''}>
              {group.label && <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.label}</p>}
              {vis.map(item => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <item.icon className="h-[18px] w-[18px]" />{item.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900 dark:to-blue-900 rounded-xl p-3">
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">ERP HR v3.0</p>
          <p className="text-xs text-primary-500 dark:text-primary-400 mt-0.5">Akademik Prototip</p>
        </div>
      </div>
    </aside>
  );
}