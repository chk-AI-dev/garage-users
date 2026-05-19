import React, { useMemo, useState } from 'react';

export default function DataTable({ columns = [], data = [] }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [filter, setFilter] = useState('');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let rows = data;
    if (q) {
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa === sb) return 0;
      return sortDir === 'asc' ? (sa > sb ? 1 : -1) : (sa > sb ? -1 : 1);
    });
  }, [data, filter, sortKey, sortDir]);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2">
        <input
          className="border rounded px-3 py-1 w-60"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  <button
                    type="button"
                    onClick={() => c.sortable && handleSort(c.key)}
                    className="flex items-center gap-2"
                  >
                    {c.label}
                    {c.sortable && sortKey === c.key && (
                      <span className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filtered.map((row, idx) => (
              <tr key={row._id || idx} className={idx % 2 ? 'bg-gray-50' : ''}>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-top">
                    {c.render ? c.render(row) : String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
