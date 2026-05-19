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
  const [employees, setEmployees] = useState([]);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    firstName:'',lastName:'',nationalId:'',email:'',phone:'',gender:'',
    dateOfBirth:'',address:'',iban:'',photo:'',hireDate:'',departmentId:'',positionId:'',
    managerId:'',grossSalary:'',workType:'FULL_TIME',workLocation:'OFFICE',
    emergencyContactName:'',emergencyContactPhone:'',role:'EMPLOYEE',password:''
  });

  useEffect(() => {
    api.get('/api/departments').then(r => setDepartments(r.data.data || []));
    api.get('/api/positions').then(r => setPositions(r.data.data || []));
    employeeService.list({ limit: 100 }).then(r => setEmployees(r.data.data?.items || []));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Lutfen bir görsel secin');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm(prev => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await employeeService.create(form); navigate('/employees'); }
    catch (err) { setError(err.response?.data?.message || 'Hata'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Yeni Çalışan Ekle</h1>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider border-b pb-2">Profil Fotoğrafı</h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {preview ? <img src={preview} alt="Önizleme" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Fotoğraf</span>}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="block text-sm text-gray-600" />
              <p className="text-xs text-gray-400 mt-1">PNG/JPG, akademik prototip icin base64 saklanir.</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider border-b pb-2">Kişisel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Ad *" name="firstName" value={form.firstName} onChange={handleChange} required />
            <Input label="Soyad *" name="lastName" value={form.lastName} onChange={handleChange} required />
            <Input label="TC Kimlik No *" name="nationalId" value={form.nationalId} onChange={handleChange} maxLength="11" required />
            <Input label="E-posta *" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Seçiniz</option><option value="MALE">Erkek</option><option value="FEMALE">Kadin</option><option value="OTHER">Diğer</option>
              </select>
            </div>
            <Input label="Doğum Tarihi *" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
            <Input label="IBAN" name="iban" value={form.iban} onChange={handleChange} placeholder="TR..." />
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <textarea name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider border-b pb-2">Is Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="İşe Giriş Tarihi *" name="hireDate" type="date" value={form.hireDate} onChange={handleChange} required />
            <Input label="Brüt Maaş (TL) *" name="grossSalary" type="number" value={form.grossSalary} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departman *</label>
              <select name="departmentId" value={form.departmentId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Seçiniz</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon *</label>
              <select name="positionId" value={form.positionId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Seçiniz</option>{positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Tipi</label>
              <select name="workType" value={form.workType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="FULL_TIME">Tam Zamanli</option><option value="PART_TIME">Yari Zamanli</option><option value="INTERN">Stajyer</option><option value="CONTRACT">Sözleşmeli</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Lokasyonu</label>
              <select name="workLocation" value={form.workLocation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="OFFICE">Ofis</option><option value="REMOTE">Uzaktan</option><option value="HYBRID">Hibrit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yönetici</label>
              <select name="managerId" value={form.managerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Seçiniz</option>{employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider border-b pb-2">Acil Durum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Acil Durum Kisi" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
            <Input label="Acil Durum Tel" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider border-b pb-2">Hesap Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sistem Rolu *</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                <option value="EMPLOYEE">Çalışan</option><option value="MANAGER">Yönetici</option><option value="HR_MANAGER">IK Yöneticisi</option><option value="FINANCE">Finans</option><option value="ADMIN">Admin</option>
              </select>
            </div>
            <Input label="Parola *" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" type="button" onClick={() => navigate('/employees')}>İptal</Button>
          <Button type="submit" loading={loading}>Kaydet</Button>
        </div>
      </form>
    </div>
  );
}