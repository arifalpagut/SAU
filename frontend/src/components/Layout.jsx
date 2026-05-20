import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard",   label: "Panel" },
  { to: "/employees",   label: "Çalışanlar" },
  { to: "/leaves",      label: "İzinler" },
  { to: "/performance", label: "Performans" },
  { to: "/approvals",   label: "Onaylar" },
];

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-indigo-600">
          ERP HR Sistemi
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-indigo-900 font-semibold" : "hover:bg-indigo-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-indigo-600">
          <p className="text-sm truncate">{user?.email}</p>
          <button onClick={handleLogout} className="mt-2 w-full text-left text-sm text-indigo-200 hover:text-white">
            Çıkış Yap
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
