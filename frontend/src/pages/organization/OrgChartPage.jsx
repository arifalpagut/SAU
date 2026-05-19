import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiChevronDown, FiChevronRight, FiUsers, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const DEPT_COLORS = [
  'border-blue-400 bg-blue-50',
  'border-green-400 bg-green-50',
  'border-purple-400 bg-purple-50',
  'border-orange-400 bg-orange-50',
  'border-pink-400 bg-pink-50',
  'border-cyan-400 bg-cyan-50',
  'border-yellow-400 bg-yellow-50',
  'border-red-400 bg-red-50'
];

function getDeptColor(dept, deptMap) {
  if (!dept) return 'border-gray-300 bg-gray-50';
  if (!deptMap[dept]) {
    deptMap[dept] = DEPT_COLORS[Object.keys(deptMap).length % DEPT_COLORS.length];
  }
  return deptMap[dept];
}

function OrgNode({ node, level, deptColorMap, expandAll }) {
  const [expanded, setExpanded] = useState(level < 2 || expandAll);
  const hasChildren = node.children && node.children.length > 0;
  const colorClass = getDeptColor(node.department, deptColorMap);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative border-2 rounded-2xl p-4 min-w-[200px] max-w-[240px] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${colorClass}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
            {node.photo ? (
              <img src={node.photo} alt={`${node.firstName} ${node.lastName}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-primary-600">{node.firstName?.[0]}{node.lastName?.[0]}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{node.firstName} {node.lastName}</p>
            <p className="text-xs text-gray-600 truncate">{node.position || '-'}</p>
            <p className="text-xs text-gray-400 truncate">{node.department || '-'}</p>
          </div>
        </div>
        {hasChildren && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-sm">
            {expanded ? <FiChevronDown className="h-3 w-3 text-gray-500" /> : <FiChevronRight className="h-3 w-3 text-gray-500" />}
          </div>
        )}
        {hasChildren && (
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">{node.children.length}</span>
        )}
      </div>

      {hasChildren && expanded && (
        <>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="relative">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-300" style={{ left: '50%', right: '50%', transform: `scaleX(${node.children.length})` }}></div>
            )}
            <div className="flex gap-8 justify-center">
              {node.children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-6 bg-gray-300"></div>
                  <OrgNode node={child} level={level + 1} deptColorMap={deptColorMap} expandAll={expandAll} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const { data: orgData, loading } = useFetch(() => api.get('/api/employees/org-chart'), []);
  const [expandAll, setExpandAll] = useState(false);
  const deptColorMap = {};

  if (loading) return <LoadingSpinner />;

  const roots = orgData || [];

  const totalEmployees = (function countAll(nodes) {
    let c = nodes.length;
    nodes.forEach(n => { if (n.children) c += countAll(n.children); });
    return c;
  })(roots);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizasyon Şeması</h1>
          <p className="text-sm text-gray-500 mt-1">{totalEmployees} aktif çalışan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {expandAll ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
            {expandAll ? 'Daralt' : 'Tümü Ac'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-x-auto">
        {roots.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Organizasyon şeması oluşturmak icin çalışanlara yönetici atayin.</p>
          </div>
        ) : (
          <div className="flex justify-center gap-12 min-w-max">
            {roots.map(root => (
              <OrgNode key={root.id} node={root} level={0} deptColorMap={deptColorMap} expandAll={expandAll} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Departman Renkleri</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(deptColorMap).map(([dept, color]) => (
            <span key={dept} className={`px-3 py-1 rounded-full text-xs font-medium border ${color}`}>{dept}</span>
          ))}
        </div>
      </div>
    </div>
  );
}