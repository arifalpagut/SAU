import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { performanceService } from '../../services/performanceService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { FiStar, FiUsers, FiTrendingUp, FiClipboard } from 'react-icons/fi';

const SCORE_LABELS = { 1: 'Yetersiz', 2: 'Gelistirilmeli', 3: 'Beklenen', 4: 'Iyi', 5: 'Cok Iyi' };
const SCORE_COLORS = { 1: 'text-red-600 bg-red-50', 2: 'text-orange-600 bg-orange-50', 3: 'text-yellow-600 bg-yellow-50', 4: 'text-blue-600 bg-blue-50', 5: 'text-green-600 bg-green-50' };

function ScoreCard({ score }) {
  const s = Math.round(Number(score || 0));
  const label = SCORE_LABELS[s] || 'Belirsiz';
  const color = SCORE_COLORS[s] || 'text-gray-600 bg-gray-50';
  return (
    <div className={`rounded-lg p-3 text-center border ${color}`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        <FiStar className="h-4 w-4" /><span className="text-2xl font-bold">{score || '-'}</span><span className="text-sm">/5</span>
      </div>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}

export default function EvaluationPage() {
  const { data: evaluations, loading, refetch } = useFetch(() => performanceService.listEvaluations(), []);
  const { data: periods } = useFetch(() => performanceService.listPeriods(), []);
  const { data: criteria } = useFetch(() => performanceService.listCriteria(), []);
  const { hasRole } = usePermission();
  const [filterPeriod, setFilterPeriod] = useState('');
  const [criteriaModal, setCriteriaModal] = useState({ open: false, evaluationId: null, employeeName: '' });
  const [criteriaScores, setCriteriaScores] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const openCriteriaModal = (evalItem) => {
    const existingScores = evalItem.criterionScores || [];
    const scores = (criteria || []).map(c => {
      const existing = existingScores.find(s => (s.criterionId || s.criterion_id) === c.id);
      return { criterionId: c.id, name: c.name, description: c.description, score: existing ? Number(existing.score) : 0, comment: existing ? existing.comment || '' : '' };
    });
    setCriteriaScores(scores);
    setFeedback(evalItem.feedback || '');
    setCriteriaModal({ open: true, evaluationId: evalItem.id, employeeName: `${evalItem.employee?.firstName} ${evalItem.employee?.lastName}` });
  };

  const handleSaveCriteria = async () => {
    const incomplete = criteriaScores.filter(s => !s.score || s.score < 1 || s.score > 5);
    if (incomplete.length > 0) { alert('Tum kriterler icin 1-5 arasi puan veriniz'); return; }
    setSaving(true);
    try {
      await performanceService.scoreCriteria(criteriaModal.evaluationId, criteriaScores, feedback);
      setCriteriaModal({ open: false, evaluationId: null, employeeName: '' });
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;
  const filtered = (evaluations || []).filter(e => !filterPeriod || e.periodId === filterPeriod);
  const avgScore = filtered.length > 0 ? (filtered.reduce((a, e) => a + Number(e.overallScore || 0), 0) / filtered.length).toFixed(1) : 0;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  filtered.forEach(e => { const s = Math.round(Number(e.overallScore || 0)); if (s >= 1 && s <= 5) distribution[s]++; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Değerlendirme Sonuclari</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} değerlendirme</p></div>
        <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Tum Dönemler</option>
          {(periods || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <FiTrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Genel Ortalama</p>
          <p className="text-4xl font-bold text-primary-700 mt-1">{avgScore}</p>
          <p className="text-xs text-gray-400">/ 5.0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <FiUsers className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Değerlendirilen</p>
          <p className="text-4xl font-bold text-green-700 mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Puan Dağılımı</p>
          {[5,4,3,2,1].map(s => (
            <div key={s} className="flex items-center gap-2 mb-1">
              <span className="text-xs w-24 text-gray-500">{s} - {SCORE_LABELS[s]}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${s>=4?'bg-green-500':s>=3?'bg-yellow-500':'bg-red-500'}`}
                  style={{ width: `${filtered.length>0?(distribution[s]/filtered.length)*100:0}%` }} /></div>
              <span className="text-xs w-6 text-right text-gray-500">{distribution[s]}</span>
            </div>))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <div key={e.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{e.employee?.firstName} {e.employee?.lastName}</p>
                <p className="text-xs text-gray-500">{e.employee?.department?.name || '-'} | {e.period?.name || ''}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {e.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
              </span>
            </div>
            <ScoreCard score={e.overallScore} />
            {e.criterionScores && e.criterionScores.length > 0 && (
              <div className="mt-3 space-y-1">
                {e.criterionScores.map((cs, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-gray-500">{cs.criterion?.name || 'Kriter'}</span>
                    <span className="font-medium text-gray-700">{cs.score}/5</span>
                  </div>
                ))}
              </div>
            )}
            {e.feedback && <p className="text-xs text-gray-400 mt-2 italic">"{e.feedback}"</p>}
            {hasRole('ADMIN', 'HR_MANAGER', 'MANAGER') && (
              <Button size="sm" variant="outline" onClick={() => openCriteriaModal(e)} className="w-full mt-3">
                <FiClipboard className="mr-1 h-3 w-3" />Kriter Puanla
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={criteriaModal.open} onClose={() => setCriteriaModal({ open: false, evaluationId: null, employeeName: '' })}
        title={`Kriter Değerlendirme - ${criteriaModal.employeeName}`} size="lg">
        <div className="space-y-4">
          {criteriaScores.map((cs, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div><p className="text-sm font-semibold text-gray-900">{cs.name}</p>
                  {cs.description && <p className="text-xs text-gray-400">{cs.description}</p>}</div>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => { const u = [...criteriaScores]; u[i].score = s; setCriteriaScores(u); }}
                    className={`p-2 rounded-lg border-2 text-center transition-all ${cs.score === s ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <p className="text-sm font-bold">{s}</p>
                    <p className="text-xs text-gray-500">{SCORE_LABELS[s]}</p>
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Yorum (opsiyonel)" value={cs.comment} onChange={(e) => { const u = [...criteriaScores]; u[i].comment = e.target.value; setCriteriaScores(u); }}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genel Geri Bildirim</label>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Çalışana genel geri bildiriminizi yaziniz..." />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCriteriaModal({ open: false, evaluationId: null, employeeName: '' })}>İptal</Button>
            <Button onClick={handleSaveCriteria} loading={saving}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}