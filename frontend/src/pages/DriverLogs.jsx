import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import api from '../utils/api';

export default function DriverLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.get('/driver-logs');
        if (mounted) setLogs(res.data.logs || res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load driver logs');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const columns = [
    { key: 'tipperId', label: 'Tipper ID', sortable: true },
    { key: 'driverName', label: 'Driver', sortable: true },
    { key: 'trips', label: 'Trips', sortable: true },
    { key: 'fuelUsed', label: 'Fuel Used', sortable: true },
    { key: 'tripsPerLiter', label: 'Trips/L', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true, render: (r) => new Date(r.createdAt).toLocaleString() },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Driver Logs</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={logs} />
      )}
    </div>
  );
}
