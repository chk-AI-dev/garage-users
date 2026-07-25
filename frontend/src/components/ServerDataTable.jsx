import React, { useEffect, useState, useCallback } from 'react';
import DataTable from './DataTable';
import api from '../utils/api';
// A reusable component for displaying paginated, sortable, and searchable data from any API endpoint
export default function ServerDataTable({
  endpoint,
  columns,
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = 20,
  extraParams = {}
}) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');
  // Fetch data from the server whenever page, limit, sort, search, or extraParams change
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        q: search || undefined,
        sort: sortKey ? `${sortKey}:${sortDir}` : undefined,
        ...extraParams
      };
      const res = await api.get(endpoint, { params });
      const payload = res.data;
      // Expect API to return { data: [...], total } or { items: [...], total }
      const items = payload.data || payload.items || payload.logs || payload.records || payload || [];
      setData(Array.isArray(items) ? items : []);
      setTotal(Number(payload.total ?? payload.count ?? items.length ?? 0));
    } catch (err) {
      console.error('ServerDataTable.fetchData error', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, limit, sortKey, sortDir, search, extraParams]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleSearch = (q) => { setSearch(q); setPage(1); };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <label>Show</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
            {pageSizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span>Page {page} / {totalPages}</span>
        </div>
      </div>

      <DataTable
        columns={columns.map(c => ({...c, sortable: !!c.sortable, render: c.render}))}
        data={data}
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
