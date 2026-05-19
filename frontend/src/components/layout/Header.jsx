import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../utils/roleGuard';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">ERP İnsan Kaynakları</h2>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.employee?.firstName} {user?.employee?.lastName}</p>
          <p className="text-xs text-gray-500">{ROLE_LABELS[user?.role] || user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
          <FiUser className="h-4 w-4 text-primary-600" />
        </div>
        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
          title="Çıkış Yap"
        >
          <FiLogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
