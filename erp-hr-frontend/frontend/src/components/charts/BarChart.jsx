import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BarChart({ data, dataKey, xKey = 'name', color = '#3b82f6', title }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
