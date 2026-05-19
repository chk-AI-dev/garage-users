import api from './api';


const equipmentApi = {
  // Get all equipment with filters and pagination
  getAllEquipment: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    return api.get(`/equipment?${params}`);
  },

  // Get single equipment by MongoDB ID
  getEquipmentById: async (id) => {
    return api.get(`/equipment/${id}`);
  },

  // Get equipment by Equipment ID (like EX-01)
  getEquipmentByEquipmentId: async (equipmentId) => {
    return api.get(`/equipment/equipment-id/${equipmentId}`);
  },

  // Create new equipment
  createEquipment: async (equipmentData) => {
    return api.post('/equipment', equipmentData);
  },

  // Update equipment
  updateEquipment: async (id, equipmentData) => {
    return api.put(`/equipment/${id}`, equipmentData);
  },

  // Update equipment status
  updateEquipmentStatus: async (id, status) => {
    return api.put(`/equipment/${id}/status`, { status });
  },

  // Assign operator to equipment
  assignOperator: async (id, operatorId) => {
    return api.put(`/equipment/${id}/assign-operator`, { operatorId });
  },

  // Delete equipment
  deleteEquipment: async (id) => {
    return api.delete(`/equipment/${id}`);
  },

  // Get equipment statistics
  getEquipmentStats: async () => {
    return api.get('/equipment/stats/overview');
  }
};

export default equipmentApi;
