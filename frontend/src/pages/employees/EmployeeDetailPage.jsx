import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { employeeService } from '../../services/employeeService';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import { ROLE_LABELS, STATUS_LABELS } from '../../utils/roleGuard';
import { FiCalendar, FiEdit2, FiUser, FiBriefcase, FiDollarSign, FiTarget, FiPhone } from 'react-icons/fi';

const TABS = [
  { key: 'general', label: 'Genel Bilgiler', icon: FiUser },
  { key: 'leave', label: 'İzin Geçmişi', icon: FiCalendar },
  { key: 'payroll', label: 'Bordro Geçmişi', icon: FiDollarSign },
  { key: 'performance', label: 'Performans', icon: FiTarget }
];

function InfoRow({ label, value }) {
  return (<div className="py-2 grid grid-cols-3 gap-4 border-b border-gray-50"><dt className="text-sm font-medium text-gray-500">{label}</dt><dd className="text-sm text-gray-900 col-span-2">{value || '-'}</dd></div>);
}

function LeaveCard({ balance }) {
  const p = balance.totalDays > 0 ? Math.round((balance.usedDays / balance.totalDays) * 100) : 0;
  return (<div className="bg-white rounded-lg border border-gray-200 p-3">
    <div className="flex justify-between mb-2"><h4 className="text-xs font-semibold text-gray-700">{balance.leaveType}</h4><span className="text-xs text-gray-400">{balance.year}</span></div>
    <div className="flex justify-between text-xs mb-1"><span>Kullanilan: <strong>{balance.usedDays}</strong></span><span>Kalan: <strong className="text-green-700">{balance.remainingDays}</strong></span></div>
    <div className="w-full bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${p > 80 ? 'bg-red-500' : p > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(p, 100)}%` }} /></div>
  </div>);
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const { isHR } = usePermission();
  const { data: emp, loading, refetch } = useFetch(() => employeeService.getById(id), [id]);
  const [activeTab, setActiveTab] = useState('general');
  const [leaveInfo, setLeaveInfo] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [perfHistory, setPerfHistory] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!id) return;
    setTabLoading(true);
    if (activeTab === 'general') {
      api.get(`/api/leaves/employee-info/${id}`).then(r => setLeaveInfo(r.data.data)).catch(() => setLeaveInfo(null)).finally(() => setTabLoading(false));
    } else if (activeTab === 'leave') {
      employeeService.getLeaveHistory(id).then(r => setLeaveHistory(r.data.data || [])).finally(() => setTabLoading(false));
    } else if (activeTab === 'payroll') {
      employeeService.getPayrollHistory(id).then(r => setPayrollHistory(r.data.data || [])).finally(() => setTabLoading(false));
    } else if (activeTab === 'performance') {
      employeeService.getPerformanceHistory(id).then(r => setPerfHistory(r.data.data || [])).finally(() => setTabLoading(false));
    }
  }, [id, activeTab]);

  useEffect(() => { if (editOpen) { api.get('/api/departments').then(r => setDepartments(r.data.data || [])); api.get('/api/positions').then(r => setPositions(r.data.data || []));
      employeeService.list({ limit: 100 }).then(r => setAllEmployees(r.data.data?.items || [])); } }, [editOpen]);

  const openEdit = () => {
    setPreview(emp.photo || '');
    setForm({ firstName: emp.firstName||'', lastName: emp.lastName||'', nationalId: emp.nationalId||'', email: emp.email||'', phone: emp.phone||'', gender: emp.gender||'', dateOfBirth: emp.dateOfBirth||'', address: emp.address||'', iban: emp.iban||'', photo: emp.photo||'', hireDate: emp.hireDate||'', departmentId: emp.departmentId||'', positionId: emp.positionId||'', grossSalary: emp.grossSalary||'', managerId: emp.managerId||'', workType: emp.workType||'FULL_TIME', workLocation: emp.workLocation||'OFFICE', emergencyContactName: emp.emergencyContactName||'', emergencyContactPhone: emp.emergencyContactPhone||'' });
    setError(''); setEditOpen(true);
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Lutfen bir görsel secin'); return; }
    const reader = new FileReader();
    reader.onload = () => { setPreview(reader.result); setForm(prev => ({ ...prev, photo: reader.result })); };
    reader.readAsDataURL(file);
  };
  const handleSave = async (e) => { e.preventDefault(); setSaving(true); setError(''); try { await employeeService.update(id, form); setEditOpen(false); refetch(); } catch (err) { setError(err.response?.data?.message || 'Hata'); } finally { setSaving(false); } };
  const handleStatusChange = async (s) => { if (!confirm('Durum degistirilsin mi?')) return; try { await employeeService.updateStatus(id, s); refetch(); } catch (err) { alert(err.response?.data?.message || 'Hata'); } };

  if (loading) return <LoadingSpinner />;
  if (!emp) return <p className="text-center py-12 text-gray-500">Çalışan bulunamadi</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {emp.photo ? <img src={emp.photo} alt={`${emp.firstName} ${emp.lastName}`} className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-primary-600">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>}
          </div>
          <div><h1 className="text-2xl font-bold text-gray-900">{emp.firstName} {emp.lastName}</h1><p className="text-sm text-gray-400 font-mono">{emp.employeeNo || '-'}</p></div>
        </div>
        <div className="flex items-center gap-3"><StatusBadge status={emp.status} />{isHR() && <Button onClick={openEdit}><FiEdit2 className="mr-2 h-4 w-4" />Düzenle</Button>}</div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(tab => (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><tab.icon className="h-4 w-4" />{tab.label}</button>))}
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4"><FiUser className="h-5 w-5 text-primary-600" /><h2 className="text-lg font-semibold text-gray-800">Kişisel</h2></div>
              <dl><InfoRow label="Personel No" value={emp.employeeNo} /><InfoRow label="TC Kimlik" value={emp.nationalId} /><InfoRow label="E-posta" value={emp.email} /><InfoRow label="Telefon" value={emp.phone} /><InfoRow label="Cinsiyet" value={STATUS_LABELS[emp.gender] || emp.gender} /><InfoRow label="Doğum Tarihi" value={formatDate(emp.dateOfBirth)} /><InfoRow label="IBAN" value={emp.iban} /><InfoRow label="Adres" value={emp.address} /></dl>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4"><FiBriefcase className="h-5 w-5 text-primary-600" /><h2 className="text-lg font-semibold text-gray-800">Is Bilgileri</h2></div>
              <dl><InfoRow label="Departman" value={emp.department?.name} /><InfoRow label="Pozisyon" value={emp.position?.title} /><InfoRow label="Çalışma Tipi" value={STATUS_LABELS[emp.workType] || emp.workType} /><InfoRow label="Lokasyon" value={STATUS_LABELS[emp.workLocation] || emp.workLocation} /><InfoRow label="Yönetici" value={emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : '-'} /><InfoRow label="İşe Giriş" value={formatDate(emp.hireDate)} /><InfoRow label="Brüt Maaş" value={formatCurrency(emp.grossSalary)} /><InfoRow label="Rol" value={ROLE_LABELS[emp.user?.role] || '-'} /></dl>
            </div>
          </div>
          {(emp.emergencyContactName || emp.emergencyContactPhone) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4"><FiPhone className="h-5 w-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-800">Acil Durum</h2></div>
              <dl><InfoRow label="Kisi" value={emp.emergencyContactName} /><InfoRow label="Telefon" value={emp.emergencyContactPhone} /></dl>
            </div>
          )}
          {leaveInfo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4"><FiCalendar className="h-5 w-5 text-primary-600" /><h2 className="text-lg font-semibold text-gray-800">İzin Haklari</h2></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-primary-50 rounded-lg p-3 text-center"><p className="text-xs text-primary-600">Kıdem</p><p className="text-xl font-bold text-primary-800">{leaveInfo.entitlement?.seniority} yil</p></div>
                <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-xs text-blue-600">Yas</p><p className="text-xl font-bold text-blue-800">{leaveInfo.entitlement?.age}</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xs text-green-600">Yillik Hak</p><p className="text-xl font-bold text-green-800">{leaveInfo.entitlement?.days} gun</p></div>
                <div className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-xs text-gray-600">Kural</p><p className="text-xs font-medium text-gray-800 mt-1">{leaveInfo.entitlement?.rule}</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{leaveInfo.balances?.map((b, i) => <LeaveCard key={i} balance={b} />)}</div>
            </div>
          )}
          {isHR() && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Durum Degistir</h2>
              <div className="flex gap-2">{['ACTIVE','INACTIVE','ON_LEAVE','TERMINATED'].map(s => (<Button key={s} size="sm" variant={emp.status===s?'primary':'outline'} onClick={()=>handleStatusChange(s)} disabled={emp.status===s}>{STATUS_LABELS[s]||s}</Button>))}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'leave' && (
        <div>{tabLoading ? <LoadingSpinner /> : (
          <Table headers={['İzin Türü','Başlangıç','Bitiş','Gun','Durum']}>
            {leaveHistory.map(l => (<tr key={l.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm">{l.leaveType?.name||'-'}</td><td className="px-6 py-4 text-sm">{formatDate(l.startDate)}</td><td className="px-6 py-4 text-sm">{formatDate(l.endDate)}</td><td className="px-6 py-4 text-sm">{l.totalDays}</td><td className="px-6 py-4"><StatusBadge status={l.status}/></td></tr>))}
          </Table>
        )}</div>
      )}

      {activeTab === 'payroll' && (
        <div>{tabLoading ? <LoadingSpinner /> : (
          <Table headers={['Dönem','Brut','Kesinti','Net','Durum']}>
            {payrollHistory.map(p => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm">{p.periodMonth}/{p.periodYear}</td><td className="px-6 py-4 text-sm">{formatCurrency(p.totalGrossEarnings||p.grossSalary)}</td><td className="px-6 py-4 text-sm text-red-600">{formatCurrency(p.totalDeductions)}</td><td className="px-6 py-4 text-sm font-semibold text-green-700">{formatCurrency(p.netSalary)}</td><td className="px-6 py-4"><StatusBadge status={p.status}/></td></tr>))}
          </Table>
        )}</div>
      )}

      {activeTab === 'performance' && (
        <div>{tabLoading ? <LoadingSpinner /> : (
          <Table headers={['Dönem','Puan','Durum']}>
            {perfHistory.map(e => (<tr key={e.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm">{e.period?.name||'-'}</td><td className="px-6 py-4 text-sm font-bold text-primary-700">{e.overallScore||'-'}/5</td><td className="px-6 py-4"><StatusBadge status={e.status}/></td></tr>))}
          </Table>
        )}</div>
      )}

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Çalışan Düzenle" size="xl">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              {preview ? <img src={preview} alt="Önizleme" className="w-full h-full object-cover" /> : <span className="text-sm text-gray-400">Fotoğraf</span>}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="block text-sm text-gray-600" />
              <p className="text-xs text-gray-400 mt-1">Yeni fotoğraf secilebilir.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Ad" name="firstName" value={form.firstName} onChange={handleChange} required />
            <Input label="Soyad" name="lastName" value={form.lastName} onChange={handleChange} required />
            <Input label="TC Kimlik" name="nationalId" value={form.nationalId} onChange={handleChange} maxLength="11" required />
            <Input label="E-posta" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label><select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="">Seçiniz</option><option value="MALE">Erkek</option><option value="FEMALE">Kadin</option></select></div>
            <Input label="Doğum Tarihi" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
            <Input label="IBAN" name="iban" value={form.iban} onChange={handleChange} />
            <Input label="İşe Giriş" name="hireDate" type="date" value={form.hireDate} onChange={handleChange} required />
            <Input label="Brüt Maaş" name="grossSalary" type="number" value={form.grossSalary} onChange={handleChange} required />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Departman</label><select name="departmentId" value={form.departmentId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required><option value="">Seçiniz</option>{departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon</label><select name="positionId" value={form.positionId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required><option value="">Seçiniz</option>{positions.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Tipi</label><select name="workType" value={form.workType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="FULL_TIME">Tam Zamanli</option><option value="PART_TIME">Yari Zamanli</option><option value="INTERN">Stajyer</option><option value="CONTRACT">Sözleşmeli</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon</label><select name="workLocation" value={form.workLocation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="OFFICE">Ofis</option><option value="REMOTE">Uzaktan</option><option value="HYBRID">Hibrit</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Yönetici</label><select name="managerId" value={form.managerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="">Seçiniz</option>{allEmployees.filter(e => e.id !== id).map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}</select></div>
            <Input label="Acil Durum Kisi" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
            <Input label="Acil Durum Tel" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} />
            <div className="md:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-1">Adres</label><textarea name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={() => setEditOpen(false)}>İptal</Button><Button type="submit" loading={saving}>Kaydet</Button></div>
        </form>
      </Modal>
    </div>
  );
}