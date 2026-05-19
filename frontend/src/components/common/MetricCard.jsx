import { useNavigate } from 'react-router-dom';

export default function MetricCard({ icon: Icon, title, value, subtitle, trend, color, to, size = 'md' }) {
  const navigate = useNavigate();
  const isClickable = !!to;
  const sizeClass = size === 'lg' ? 'p-6' : 'p-4';
  const valueClass = size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <div
      onClick={() => isClickable && navigate(to)}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${sizeClass} hover:shadow-lg transition-all duration-300 ${isClickable ? 'cursor-pointer hover:border-primary-200 hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-700' : trend.startsWith('-') ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className={`${valueClass} font-bold text-gray-900 tracking-tight`}>{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {isClickable && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-primary-600 font-medium">Detay &rarr;</p>
        </div>
      )}
    </div>
  );
}