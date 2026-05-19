import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { usePermission } from '../../hooks/usePermission';
import { performanceService } from '../../services/performanceService';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function GoalManagementPage() {
  const { data: goals, loading, refetch } = useFetch(() => performanceService.listGoals(), []);
  const { hasRole, user } = usePermission();
  const [scoreModal, setScoreModal] = useState({ open: false, goalId: null, type: '' });
  const [score, setScore] = useState('');

  const handleScore = async () => {
    try {
      if (scoreModal.type === 'self') {
        await performanceService.selfScore(scoreModal.goalId, Number(score));
      } else {
        await performanceService.managerScore(scoreModal.goalId, Number(score));
      }
      setScoreModal({ open: false, goalId: null, type: '' });
      setScore('');
      refetch();
    } catch (err) { alert(err.response?.data?.message || 'Hata'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Hedef Yönetimi</h1>
      <Table headers={['Çalışan', 'Hedef', 'Ağırlık', 'Öz Puan', 'Yönetici Puanı', 'Final', 'İşlem']}>
        {(goals || []).map((g) => (
          <tr key={g.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{g.employee?.firstName} {g.employee?.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{g.title}</td>
            <td className="px-6 py-4 text-sm text-gray-500">%{g.weight}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{g.selfScore ?? '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{g.managerScore ?? '-'}</td>
            <td className="px-6 py-4 text-sm font-semibold text-primary-700">{g.finalScore ?? '-'}</td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                {g.employeeId === user?.employeeId && !g.selfScore && (
                  <Button size="sm" onClick={() => setScoreModal({ open: true, goalId: g.id, type: 'self' })}>Öz Puan</Button>
                )}
                {hasRole('ADMIN','HR_MANAGER','MANAGER') && !g.managerScore && (
                  <Button size="sm" variant="secondary" onClick={() => setScoreModal({ open: true, goalId: g.id, type: 'manager' })}>Yönetici Puanı</Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <Modal isOpen={scoreModal.open} onClose={() => setScoreModal({ open: false, goalId: null, type: '' })} title={scoreModal.type === 'self' ? 'Öz Değerlendirme' : 'Yönetici Değerlendirmesi'} size="sm">
        <div className="space-y-4">
          <Input label="Puan (1-5)" type="number" min="1" max="5" step="0.1" value={score} onChange={(e) => setScore(e.target.value)} required />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setScoreModal({ open: false, goalId: null, type: '' })}>İptal</Button>
            <Button onClick={handleScore}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
