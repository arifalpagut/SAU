import React, { useEffect, useState } from "react";
import { getLeaves } from "../../services/leaveService";

const statusMap = { pending: "Bekliyor", approved: "Onaylandı", rejected: "Reddedildi" };
const badgeColor = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };

export default function LeaveListPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaves()
      .then((r) => setLeaves(r.data?.data || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">İzin Talepleri</h1>
      {loading ? <p>Yükleniyor...</p> : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Çalışan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tür</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlangıç</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bitiş</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{l.employee ? `${l.employee.firstName} ${l.employee.lastName}` : l.employeeId}</td>
                  <td className="px-6 py-4 text-sm">{l.type || l.leaveType || "—"}</td>
                  <td className="px-6 py-4 text-sm">{l.startDate?.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-sm">{l.endDate?.slice(0, 10)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${badgeColor[l.status] || "bg-gray-100"}`}>
                      {statusMap[l.status] || l.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Kayıt bulunamadı.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
