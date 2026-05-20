import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ApprovalListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leaves?status=pending")
      .then((r) => setItems(r.data?.data || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.patch(`/leaves/${id}`, { status });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bekleyen Onaylar</h1>
      {loading ? <p>Yükleniyor...</p> : items.length === 0 ? (
        <p className="text-gray-400">Bekleyen onay yok.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {item.employee ? `${item.employee.firstName} ${item.employee.lastName}` : `#${item.employeeId}`}
                </p>
                <p className="text-sm text-gray-500">
                  {item.startDate?.slice(0, 10)} → {item.endDate?.slice(0, 10)} | {item.type || item.leaveType || "İzin"}
                </p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleAction(item.id, "approved")}
                  className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 text-sm">Onayla</button>
                <button onClick={() => handleAction(item.id, "rejected")}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 text-sm">Reddet</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
