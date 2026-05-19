export default function Table({ headers, children, empty = 'Kayıt bulunamadı' }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
      {(!children || (Array.isArray(children) && children.length === 0)) && (
        <div className="text-center py-12 text-gray-500">{empty}</div>
      )}
    </div>
  );
}
