import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function PieChart({ data, dataKey = 'value', nameKey = 'name', title }) {
  const total = data?.reduce((a, d) => a + (d[dataKey] || 0), 0) || 0;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>}
      {total > 0 && <p className="text-xs text-gray-400 mb-3">Toplam: {total}</p>}
      <ResponsiveContainer width="100%" height={260}>
        <RePieChart>
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, '']} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}