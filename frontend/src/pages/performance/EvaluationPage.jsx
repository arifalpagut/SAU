import { useFetch } from '../../hooks/useFetch';
import { performanceService } from '../../services/performanceService';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EvaluationPage() {
  const { data: evaluations, loading } = useFetch(() => performanceService.listEvaluations(), []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Değerlendirme Sonuçları</h1>
      <Table headers={['Çalışan', 'Departman', 'Dönem', 'Genel Puan', 'Durum']}>
        {(evaluations || []).map((e) => (
          <tr key={e.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.employee?.firstName} {e.employee?.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{e.employee?.department?.name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{e.period?.name || '-'}</td>
            <td className="px-6 py-4 text-sm font-bold text-primary-700">{e.overallScore ?? '-'} / 5</td>
            <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
