import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { userApi } from '../utils/apiClient';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'driver',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [pageNum, filterRole, filterStatus]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
        role: filterRole || undefined,
        status: filterStatus || undefined
      };

      const response = await userApi.getAllUsers(params);
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'driver',
        phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await userApi.updateUser(editingUser._id, formData);
        toast.success('User updated successfully');
      } else {
        await userApi.createUser(formData);
        toast.success('User created successfully');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Error deleting user');
      }
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await userApi.updateUserStatus(userId, newStatus);
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user status');
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <div className="container user-management">
      <div className="management-header">
        <h2>User Management</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New User
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Role</label>
          <select 
            className="filter-input"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="driver">Driver</option>
            <option value="operator">Operator</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select 
            className="filter-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter(user => 
                  user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => (
                  <tr key={user._id}>
                    <td><strong>{user.firstName} {user.lastName}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={user.status}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="action-button edit"
                          title="Edit user"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="action-button delete"
                          title="Delete user"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data-cell">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPageNum(Math.max(1, pageNum - 1))}
            disabled={pageNum === 1}
            className="page-button"
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setPageNum(page)}
              className={`page-button ${pageNum === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setPageNum(Math.min(totalPages, pageNum + 1))}
            disabled={pageNum === totalPages}
            className="page-button"
          >
            Next →
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingUser ? '✏️ Edit User' : '➕ Create New User'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        submitText={editingUser ? 'Update User' : 'Create User'}
      >
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            name="firstName"
            className="form-input"
            placeholder="John"
            value={formData.firstName}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            name="lastName"
            className="form-input"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleFormChange}
            required
            disabled={editingUser ? true : false}
          />
        </div>

        {!editingUser && (
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleFormChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Role *</label>
          <select
            name="role"
            className="form-input"
            value={formData.role}
            onChange={handleFormChange}
          >
            <option value="driver">Driver</option>
            <option value="operator">Operator</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={handleFormChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
