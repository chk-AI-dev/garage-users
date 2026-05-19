import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import equipmentApi from '../utils/equipmentApi';
import { userApi } from '../utils/apiClient';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import './EquipmentManagement.css';

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    assignedArea: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    equipmentId: '',
    type: 'Excavator',
    status: 'Working',
    capacity: '',
    assignedArea: '',
    operator: '',
    purchaseDate: '',
    registrationNumber: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  const EQUIPMENT_TYPES = ['Excavator', 'Tipper', 'Dozer', 'Grader', 'Diesel Bowser', 'Crane', 'Loader', 'Other'];
  const EQUIPMENT_STATUS = ['Working', 'In Maintenance', 'Out of Service', 'Inactive'];

  // Fetch equipment list
  useEffect(() => {
    fetchEquipment();
    fetchOperators();
  }, [page, filters]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const response = await equipmentApi.getAllEquipment(page, 10, {
        type: filters.type,
        status: filters.status,
        assignedArea: filters.assignedArea,
        search: searchTerm
      });
      

      if (response.data.success) {
        console.log('Fetched equipment: ', response);
        setEquipment(response.data.equipment);
        setTotal(response.data.total);
      }
    } catch (error) {
      toast.error('Failed to fetch equipment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await userApi.getAllUsers({ page: 1, limit: 100, role: 'operator' });
      if (response.success || response.data?.users) {
        setOperators(response.data?.users || response.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch operators', error);
    }
  };

  const handleOpenModal = (equip = null) => {
    if (equip) {
      setEditingId(equip._id);
      setIsEditing(true);
      setFormData({
        equipmentId: equip.equipmentId,
        type: equip.type,
        status: equip.status,
        capacity: equip.capacity,
        assignedArea: equip.assignedArea,
        operator: equip.operator?._id || '',
        purchaseDate: equip.purchaseDate ? equip.purchaseDate.split('T')[0] : '',
        registrationNumber: equip.registrationNumber || '',
        notes: equip.notes || ''
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        equipmentId: '',
        type: 'Excavator',
        status: 'Working',
        capacity: '',
        assignedArea: '',
        operator: '',
        purchaseDate: '',
        registrationNumber: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.equipmentId.trim()) {
      toast.error('Equipment ID is required');
      return;
    }
    if (!formData.type) {
      toast.error('Equipment type is required');
      return;
    }
    if (!formData.capacity.trim()) {
      toast.error('Capacity is required');
      return;
    }
    if (!formData.assignedArea.trim()) {
      toast.error('Assigned area is required');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        operator: formData.operator || undefined
      };

      let response;
      if (isEditing) {
        response = await equipmentApi.updateEquipment(editingId, submitData);
      } else {
        response = await equipmentApi.createEquipment(submitData);
      }

      if (response.success) {
        toast.success(isEditing ? 'Equipment updated successfully' : 'Equipment created successfully');
        handleCloseModal();
        setPage(1);
        fetchEquipment();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await equipmentApi.deleteEquipment(id);
      if (response.success) {
        toast.success('Equipment deleted successfully');
        setPage(1);
        fetchEquipment();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete equipment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await equipmentApi.updateEquipmentStatus(id, newStatus);
      if (response.success) {
        toast.success('Status updated successfully');
        fetchEquipment();
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEquipment();
  };

  const pages = Math.ceil(total / 10);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Working':
        return 'badge-success';
      case 'In Maintenance':
        return 'badge-warning';
      case 'Out of Service':
        return 'badge-danger';
      case 'Inactive':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  if (loading && page === 1 && equipment.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="equipment-management">
      <div className="management-header">
        <h2>Equipment Management</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Equipment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Search by ID, type, or registration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input search-input"
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>

        <div className="filter-group">
          <label>Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="form-input"
          >
            <option value="">All Types</option>
            {EQUIPMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="form-input"
          >
            <option value="">All Status</option>
            {EQUIPMENT_STATUS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Assigned Area</label>
          <input
            type="text"
            name="assignedArea"
            value={filters.assignedArea}
            onChange={handleFilterChange}
            placeholder="e.g., Pit A"
            className="form-input"
          />
        </div>
      </div>

      {/* Equipment Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Equipment ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Capacity</th>
              <th>Assigned Area</th>
              <th>Operator</th>
              <th>Reg. Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No equipment found</td>
              </tr>
            ) : (
              equipment.map(equip => (
                <tr key={equip._id}>
                  <td className="font-bold">{equip.equipmentId}</td>
                  <td>{equip.type}</td>
                  <td>
                    <select
                      value={equip.status}
                      onChange={(e) => handleStatusChange(equip._id, e.target.value)}
                      className={`status-select badge ${getStatusBadgeClass(equip.status)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {EQUIPMENT_STATUS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>{equip.capacity}</td>
                  <td>{equip.assignedArea}</td>
                  <td>
                    {equip.operator ? (
                      <span className="operator-name">
                        {equip.operator.firstName} {equip.operator.lastName}
                      </span>
                    ) : (
                      <span className="text-muted">Not assigned</span>
                    )}
                  </td>
                  <td>{equip.registrationNumber || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleOpenModal(equip)}
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteEquipment(equip._id)}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="page-info">Page {page} of {pages}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={isEditing ? 'Edit Equipment' : 'Add New Equipment'}
      >
        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-group">
            <label>Equipment ID *</label>
            <input
              type="text"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleFormChange}
              placeholder="e.g., EX-01, TP-01"
              className="form-input"
              disabled={isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleFormChange}
              className="form-input"
              required
            >
              {EQUIPMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="form-input"
              required
            >
              {EQUIPMENT_STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Capacity *</label>
            <input
              type="text"
              name="capacity"
              value={formData.capacity}
              onChange={handleFormChange}
              placeholder="e.g., 2.5 Cum, 20 Ton"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Assigned Area *</label>
            <input
              type="text"
              name="assignedArea"
              value={formData.assignedArea}
              onChange={handleFormChange}
              placeholder="e.g., Pit A, Route, Site B"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Operator</label>
            <select
              name="operator"
              value={formData.operator}
              onChange={handleFormChange}
              className="form-input"
            >
              <option value="">Not Assigned</option>
              {operators.map(op => (
                <option key={op._id} value={op._id}>
                  {op.firstName} {op.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleFormChange}
              placeholder="e.g., HR-01-AB-1234"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleFormChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="Additional notes..."
              className="form-input"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Equipment' : 'Add Equipment')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EquipmentManagement;
