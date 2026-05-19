import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', nationalId: '', email: '', phone: '',
    dateOfBirth: '', hireDate: '', departmentId: '', positionId: '',
    managerId: '', grossSalary: '', role: 'EMPLOYEE', password: ''
  });

  useEffect(() => {
    api.get('/api/departments').then(r => setDepartments(r.data.data || []));
    api.get('/api/positions').then(r => setPositions(r.data.data || []));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await employeeService.create(form);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Yeni Çalışan Ekle</h1>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Ad" name="firstName" value={form.firstName} onChange={handleChange} required />
          <Input label="Soyad" name="lastName" value={form.lastName} onChange={handleChange} required />
          <Input label="TC Kimlik No" name="nationalId" value={form.nationalId} onChange={handleChange} maxLength="11" required />
          <Input label="E-posta" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Doğum Tarihi" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
          <Input label="İşe Giriş Tarihi" name="hireDate" type="date" value={form.hireDate} onChange={handleChange} required />
          <Input label="Brüt Maaş (TL)" name="grossSalary" type="number" value={form.grossSalary} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
            <select name="departmentId" value={form.departmentId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
              <option value="">Seçiniz</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon</label>
            <select name="positionId" value={form.positionId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
              <option value="">Seçiniz</option>
              {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
              <option value="EMPLOYEE">Çalışan</option>
              <option value="MANAGER">Birim Yöneticisi</option>
              <option value="HR_MANAGER">İK Yöneticisi</option>
              <option value="FINANCE">Finans</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <Input label="Parola" name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate('/employees')}>İptal</Button>
          <Button type="submit" loading={loading}>Kaydet</Button>
        </div>
      </form>
    </div>
  );
}
