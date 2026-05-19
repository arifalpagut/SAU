import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiBell, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../utils/roleGuard';
import api from '../../services/api';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [dropOpen, setDropOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [dark]);

  useEffect(() => {
    const load = () => { api.get('/api/notifications/unread-count').then(r => setUnread(r.data.data?.count || 0)).catch(() => {}); };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const openDrop = async () => {
    setDropOpen(!dropOpen);
    if (!dropOpen) { try { const { data } = await api.get('/api/notifications', { params: { limit: 5 } }); setNotifs(data.data?.items || []); } catch {} }
  };

  const markRead = async (id) => { await api.patch('/api/notifications/' + id + '/read').catch(() => {}); setUnread(Math.max(0, unread - 1)); setNotifs(notifs.map(n => n.id === id ? { ...n, isRead: true } : n)); };
  const markAll = async () => { await api.patch('/api/notifications/read-all').catch(() => {}); setUnread(0); setNotifs(notifs.map(n => ({ ...n, isRead: true }))); };

  const TYPE_COLORS = { INFO: 'bg-blue-500', WARNING: 'bg-yellow-500', SUCCESS: 'bg-green-500', ERROR: 'bg-red-500' };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
          <FiMenu className="h-5 w-5" />
        </button>
        <h2 className="text-base font-semibold text-gray-800 dark:text-white hidden md:block">ERP Insan Kaynaklari</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={() => setDark(!dark)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Tema">
          {dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
        </button>
        <div className="relative">
          <button onClick={openDrop} className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiBell className="h-5 w-5" />
            {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unread > 9 ? '9+' : unread}</span>}
          </button>
          {dropOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bildirimler</h3>
                {unread > 0 && <button onClick={markAll} className="text-xs text-primary-600">Tümü okundu</button>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? <p className="p-4 text-sm text-gray-400 text-center">Bildirim yok</p> : notifs.map(n => (
                  <div key={n.id} onClick={() => !n.isRead && markRead(n.id)} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${TYPE_COLORS[n.type] || 'bg-gray-400'}`}></div>
                      <div className="flex-1 min-w-0"><p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</p><p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden md:block"></div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">{user?.employee?.firstName?.[0]}{user?.employee?.lastName?.[0]}</span>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.employee?.firstName} {user?.employee?.lastName}</p>
            <p className="text-xs text-gray-400">{ROLE_LABELS[user?.role] || user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900" title="Çıkış"><FiLogOut className="h-5 w-5" /></button>
      </div>
    </header>
  );
}