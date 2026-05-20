import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: "Toplam Çalışan",   value: stats?.totalEmployees   ?? "—", color: "bg-blue-500" },
    { label: "Aktif Çalışan",    value: stats?.activeEmployees  ?? "—", color: "bg-green-500" },
    { label: "Bekleyen İzin",    value: stats?.pendingLeaves    ?? "—", color: "bg-yellow-500" },
    { label: "Departman Sayısı", value: stats?.totalDepartments ?? "—", color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kontrol Paneli</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-6 flex items-center space-x-4">
            <div className={`${c.color} text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold`}>
              {typeof c.value === "number" ? c.value : "?"}
            </div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-2xl font-semibold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats?.departments && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Departman Dağılımı</h2>
          <div className="space-y-3">
            {stats.departments.map((d) => (
              <div key={d.name} className="flex items-center">
                <span className="w-40 text-sm text-gray-600 truncate">{d.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                  <div className="bg-indigo-500 h-4 rounded-full"
                    style={{ width: `${Math.min((d.count / Math.max(...stats.departments.map((x) => x.count))) * 100, 100)}%` }} />
                </div>
                <span className="text-sm font-medium w-8 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
