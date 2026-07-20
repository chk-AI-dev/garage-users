import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../utils/apiClient';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, isSupervisor } = useAuth();

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await dashboardApi.getUserStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };
  // Only allow access if user is authenticated and has the right role
  if (loading) return <LoadingSpinner />;
  // Redirect to admin dashboard if the user is an admin
  return (
    <div className="container dashboard">
      <h2>Welcome, {stats?.firstName}!</h2>

      <div className="row">
        <div className="card">
          <div className="card-subtitle">First Name</div>
          <div className="card-value">{stats?.firstName}</div>
        </div>

        <div className="card">
          <div className="card-subtitle">Last Name</div>
          <div className="card-value">{stats?.lastName}</div>
        </div>

        <div className="card">
          <div className="card-subtitle">Role</div>
          <div className="card-value" style={{ fontSize: '18px' }}>
            {(stats?.role || 'N/A').charAt(0).toUpperCase() + (stats?.role || 'N/A').slice(1)}
          </div>
        </div>

        <div className="card">
          <div className="card-subtitle">Status</div>
          <div className="card-value" style={{ 
            fontSize: '18px',
            color: stats?.status === 'active' ? '#388e3c' : '#d32f2f'
          }}>
            {(stats?.status || 'N/A').charAt(0).toUpperCase() + (stats?.status || 'N/A').slice(1)}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>User Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{stats?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member Since:</span>
            <span className="info-value">{new Date(stats?.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {stats?.profileImage && (
        <div className="card" style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>Profile Picture</h3>
          <img src={`${import.meta.env.VITE_SERVER_URL}${stats.profileImage}`} alt="Profile" className="profile-preview" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
