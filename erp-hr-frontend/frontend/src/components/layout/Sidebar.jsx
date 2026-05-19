import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiTarget, FiGrid, FiLayers } from 'react-icons/fi';
import { usePermission } from '../../hooks/usePermission';

const menuItems = [
  { to: '/', icon: FiHome, label: 'Dashboard', roles: null },
  { to: '/employees', icon: FiUsers, label: 'Personel', roles: ['ADMIN','HR_MANAGER','MANAGER'] },
  { to: '/departments', icon: FiGrid, label: 'Departmanlar', roles: ['ADMIN','HR_MANAGER'] },
  { to: '/leaves', icon: FiCalendar, label: 'İzinler', roles: null },
  { to: '/payroll', icon: FiDollarSign, label: 'Bordro', roles: ['ADMIN','HR_MANAGER','FINANCE'] },
  { to: '/performance/goals', icon: FiTarget, label: 'Performans', roles: null },
  { to: '/performance/periods', icon: FiLayers, label: 'Dönemler', roles: ['ADMIN','HR_MANAGER'] }
];

export default function Sidebar() {
  const { hasRole } = usePermission();

  const filteredItems = menuItems.filter(item =>
    item.roles === null || hasRole(...item.roles)
  );

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">HR</span>
        </div>
        <span className="font-bold text-gray-900">ERP HR</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
