import React, { useEffect, useState } from "react";
import { getPerformanceReviews } from "../../services/performanceService";

export default function PerformanceListPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPerformanceReviews()
      .then((r) => setReviews(r.data?.data || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Performans Değerlendirmeleri</h1>
      {loading ? <p>Yükleniyor...</p> : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Çalışan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dönem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yorum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : r.employeeId}</td>
                  <td className="px-6 py-4 text-sm">{r.period || r.reviewDate?.slice(0, 10) || "—"}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{r.score ?? r.rating ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{r.comment || r.notes || "—"}</td>
                </tr>
              ))}
              {reviews.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400">Kayıt bulunamadı.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
