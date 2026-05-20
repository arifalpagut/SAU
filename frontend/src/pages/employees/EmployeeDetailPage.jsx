import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEmployee } from "../../services/employeeService";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    getEmployee(id).then((r) => setEmp(r.data?.data || r.data)).catch(() => {});
  }, [id]);

  if (!emp) return <p className="p-6">Yükleniyor...</p>;

  const fields = [
    ["Ad", emp.firstName], ["Soyad", emp.lastName], ["E-posta", emp.email],
    ["Telefon", emp.phone], ["Departman", emp.department?.name || emp.department],
    ["Pozisyon", emp.position], ["Başlangıç", emp.hireDate?.slice(0, 10)],
    ["Durum", emp.status === "active" ? "Aktif" : "Pasif"],
  ];

  return (
    <div>
      <Link to="/employees" className="text-indigo-600 hover:underline text-sm">← Listeye Dön</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{emp.firstName} {emp.lastName}</h1>
      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-gray-500 uppercase">{label}</p>
            <p className="text-lg">{value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
