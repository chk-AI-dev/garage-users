import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../utils/apiClient';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardApi.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/users" className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Manage Users
        </Link>
      </div>

      <div className="row">
        <div className="card stats-card">
          <div className="card-subtitle">Total Users</div>
          <div className="card-value">{stats?.totalUsers || 0}</div>
        </div>

        <div className="card stats-card">
          <div className="card-subtitle">Active Users</div>
          <div className="card-value">{stats?.activeUsers || 0}</div>
        </div>

        <div className="card stats-card">
          <div className="card-subtitle">Inactive Users</div>
          <div className="card-value">{stats?.inactiveUsers || 0}</div>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <h3>Users by Role</h3>
          <div className="stats-list">
            <div className="stat-item">
              <span>Admin</span>
              <span className="stat-count">{stats?.usersByRole?.admin || 0}</span>
            </div>
            <div className="stat-item">
              <span>Supervisor</span>
              <span className="stat-count">{stats?.usersByRole?.supervisor || 0}</span>
            </div>
            <div className="stat-item">
              <span>Driver</span>
              <span className="stat-count">{stats?.usersByRole?.driver || 0}</span>
            </div>
            <div className="stat-item">
              <span>Operator</span>
              <span className="stat-count">{stats?.usersByRole?.operator || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Users by Status</h3>
          <div className="stats-list">
            <div className="stat-item">
              <span>Active</span>
              <span className="stat-count active">{stats?.usersByStatus?.active || 0}</span>
            </div>
            <div className="stat-item">
              <span>Inactive</span>
              <span className="stat-count inactive">{stats?.usersByStatus?.inactive || 0}</span>
            </div>
            <div className="stat-item">
              <span>Suspended</span>
              <span className="stat-count suspended">{stats?.usersByStatus?.suspended || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Users</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentUsers?.map(user => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
