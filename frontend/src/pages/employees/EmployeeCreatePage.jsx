import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createEmployee } from "../../services/employeeService";

const initialForm = {
  firstName: "", lastName: "", email: "", phone: "",
  position: "", departmentId: "", hireDate: "", salary: "",
};

export default function EmployeeCreatePage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createEmployee(form);
      navigate("/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Kayıt başarısız");
    }
  };

  const cls = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none";

  return (
    <div>
      <Link to="/employees" className="text-indigo-600 hover:underline text-sm">← Listeye Dön</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Yeni Çalışan Ekle</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="firstName" placeholder="Ad" value={form.firstName} onChange={handleChange} required className={cls} />
        <input name="lastName" placeholder="Soyad" value={form.lastName} onChange={handleChange} required className={cls} />
        <input name="email" placeholder="E-posta" value={form.email} onChange={handleChange} required type="email" className={cls} />
        <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} className={cls} />
        <input name="position" placeholder="Pozisyon" value={form.position} onChange={handleChange} className={cls} />
        <input name="departmentId" placeholder="Departman ID" value={form.departmentId} onChange={handleChange} className={cls} />
        <input name="hireDate" placeholder="Başlangıç" value={form.hireDate} onChange={handleChange} type="date" className={cls} />
        <input name="salary" placeholder="Maaş" value={form.salary} onChange={handleChange} type="number" className={cls} />
        <div className="md:col-span-2">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Kaydet</button>
        </div>
      </form>
    </div>
  );
}
