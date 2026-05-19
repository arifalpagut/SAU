import { useState, useEffect } from 'react';
import { FiPlus, FiTarget, FiStar, FiFilter } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { performanceService } from '../../services/performanceService';
import { employeeService } from '../../services/employeeService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SCORE_LABELS = { 1: 'Yetersiz', 2: 'Gelistirilmeli', 3: 'Beklenen', 4: 'Iyi', 5: 'Mukemmel' };
const SCORE_COLORS = { 1: 'bg-red-500', 2: 'bg-orange-500', 3: 'bg-yellow-500', 4: 'bg-blue-500', 5: 'bg-green-500' };
const SCORE_BG = { 1: 'bg-red-50 border-red-200', 2: 'bg-orange-50 border-orange-200', 3: 'bg-yellow-50 border-yellow-200', 4: 'bg-blue-50 border-blue-200', 5: 'bg-green-50 border-green-200' };

function ScoreBadge({ score }) {
  if (!score && score !== 0) return <span className="text-xs text-gray-400">-</span>;
  const s = Math.round(Number(score));
  const label = SCORE_LABELS[s] || score;
  const color = SCORE_COLORS[s] || 'bg-gray-500';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${color}`}>
      <FiStar className="h-3 w-3" />{score} - {label}
    </span>
  );
}

function GoalCard({ goal, onSelfScore, onManagerScore, canSelfScore, canManagerScore }) {
  const finalScore = goal.finalScore ? Number(goal.finalScore) : null;
  const progressPercent = finalScore ? (finalScore / 5) * 100 : 0;
  const s = finalScore ? Math.round(finalScore) : 0;
  const barColor = SCORE_COLORS[s] || 'bg-gray-300';

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 ${finalScore ? SCORE_BG[Math.round(finalScore)] || 'border-gray-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{goal.title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{goal.employee?.firstName} {goal.employee?.lastName}</p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">%{goal.weight}</span>
      </div>
      {goal.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{goal.description}</p>}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
        <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Oz Puan</p>
          <p className="text-sm font-bold text-gray-700">{goal.selfScore ?? '-'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Yönetici</p>
          <p className="text-sm font-bold text-gray-700">{goal.managerScore ?? '-'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Final</p>
          <p className="text-sm font-bold text-primary-700">{goal.finalScore ?? '-'}</p>
        </div>
      </div>
      {finalScore && <div className="mb-3"><ScoreBadge score={goal.finalScore} /></div>}
      <div className="flex gap-2">
        {canSelfScore && !goal.selfScore && (
          <Button size="sm" onClick={() => onSelfScore(goal.id)} className="flex-1">Oz Değerlendir</Button>
        )}
        {canManagerScore && !goal.managerScore && (
          <Button size="sm" variant="secondary" onClick={() => onManagerScore(goal.id)} className="flex-1">Yönetici Puani</Button>
        )}
      </div>
    </div>
  );
}

export default function GoalManagementPage() {
  const { data: goals, loading, refetch } = useFetch(() => performanceService.listGoals(), []);
  const { data: periods } = useFetch(() => performanceService.listPeriods(), []);
  const { hasRole, user } = usePermission();
  const [employees, setEmployees] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [scoreModal, setScoreModal] = useState({ open: false, goalId: null, type: '' });
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('');
  const [createForm, setCreateForm] = useState({ employeeId: '', periodId: '', title: '', description: '', weight: 25 });

  useEffect(() => {
    if (hasRole('ADMIN', 'HR_MANAGER', 'MANAGER')) {
      employeeService.list({ limit: 100 }).then(r => setEmployees(r.data.data?.items || []));
    }
  }, []);

  const filteredGoals = (goals || []).filter(g => !filterPeriod || g.periodId === filterPeriod);

  const totalWeightByEmployee = {};
  filteredGoals.forEach(g => {
    const key = g.employeeId;
    totalWeightByEmployee[key] = (totalWeightByEmployee[key] || 0) + Number(g.weight);
  });

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await performanceService.createGoal(createForm);
      setCreateOpen(false);
      setCreateForm({ employeeId: '', periodId: '', title: '', description: '', weight: 25 });
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  const handleScore = async () => {
    if (!score || Number(score) < 1 || Number(score) > 5) { alert('Puan 1-5 arasi olmalidir'); return; }
    setSaving(true);
    try {
      if (scoreModal.type === 'self') await performanceService.selfScore(scoreModal.goalId, Number(score));
      else await performanceService.managerScore(scoreModal.goalId, Number(score));
      setScoreModal({ open: false, goalId: null, type: '' });
      setScore('');
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hedef ve KPI Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredGoals.length} hedef listeleniyor</p>
        </div>
        {hasRole('ADMIN', 'HR_MANAGER', 'MANAGER') && (
          <Button onClick={() => setCreateOpen(true)}><FiPlus className="mr-2 h-4 w-4" />Yeni Hedef</Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <FiFilter className="h-4 w-4 text-gray-400" />
        <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Tum Dönemler</option>
          {(periods || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500">Toplam Hedef</p>
          <p className="text-2xl font-bold text-gray-900">{filteredGoals.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500">Puanlanan</p>
          <p className="text-2xl font-bold text-green-700">{filteredGoals.filter(g => g.finalScore).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500">Bekleyen</p>
          <p className="text-2xl font-bold text-yellow-600">{filteredGoals.filter(g => !g.finalScore).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500">Ort. Puan</p>
          <p className="text-2xl font-bold text-primary-700">
            {filteredGoals.filter(g => g.finalScore).length > 0
              ? (filteredGoals.filter(g => g.finalScore).reduce((a, g) => a + Number(g.finalScore), 0) / filteredGoals.filter(g => g.finalScore).length).toFixed(1)
              : '-'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            canSelfScore={goal.employeeId === user?.employeeId}
            canManagerScore={hasRole('ADMIN', 'HR_MANAGER', 'MANAGER')}
            onSelfScore={(id) => setScoreModal({ open: true, goalId: id, type: 'self' })}
            onManagerScore={(id) => setScoreModal({ open: true, goalId: id, type: 'manager' })}
          />
        ))}
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Yeni Hedef / KPI Oluştur" size="lg">
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Çalışan</label>
              <select value={createForm.employeeId} onChange={(e) => setCreateForm({ ...createForm, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Seçiniz</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dönem</label>
              <select value={createForm.periodId} onChange={(e) => setCreateForm({ ...createForm, periodId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Seçiniz</option>
                {(periods || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <Input label="Hedef / KPI Adi" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
            placeholder="Orn: Musteri memnuniyeti %90 ustu" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Hedefin detayli açıklamasi..." />
          </div>
          <div>
            <Input label="Ağırlık (%)" type="number" min="5" max="100" value={createForm.weight}
              onChange={(e) => setCreateForm({ ...createForm, weight: Number(e.target.value) })} required />
            {createForm.employeeId && totalWeightByEmployee[createForm.employeeId] && (
              <p className={`text-xs mt-1 ${totalWeightByEmployee[createForm.employeeId] + createForm.weight > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                Mevcut toplam: %{totalWeightByEmployee[createForm.employeeId]} + yeni %{createForm.weight} = %{totalWeightByEmployee[createForm.employeeId] + createForm.weight}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>İptal</Button>
            <Button type="submit" loading={saving}>Hedef Oluştur</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={scoreModal.open} onClose={() => { setScoreModal({ open: false, goalId: null, type: '' }); setScore(''); }}
        title={scoreModal.type === 'self' ? 'Oz Değerlendirme' : 'Yönetici Değerlendirmesi'} size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setScore(String(s))}
                className={`p-3 rounded-lg border-2 text-center transition-all ${String(s) === score ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <p className="text-lg font-bold text-gray-900">{s}</p>
                <p className="text-xs text-gray-500">{SCORE_LABELS[s]}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setScoreModal({ open: false, goalId: null, type: '' }); setScore(''); }}>İptal</Button>
            <Button onClick={handleScore} loading={saving} disabled={!score}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}