// API service for making HTTP requests
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getProfile(token) {
    return this.request('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Material endpoints
  async getMaterials(token, page = 1, limit = 10) {
    return this.request(`/materials?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getMaterialById(token, id) {
    return this.request(`/materials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async viewMaterial(token, id) {
    return this.request(`/materials/${id}/view`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Purchase endpoints
  async createCheckoutSession(token, materialId) {
    return this.request('/purchases/checkout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ materialId }),
    });
  }

  async getUserPurchases(token) {
    return this.request('/purchases', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Admin endpoints
  async getAllUsers(token, page = 1, limit = 10) {
    return this.request(`/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAllLogs(token, page = 1, limit = 10) {
    return this.request(`/logs?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async toggleUserStatus(token, userId) {
    return this.request(`/users/${userId}/toggle-status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async toggleMaterialStatus(token, materialId) {
    return this.request(`/materials/${materialId}/toggle-status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteMaterial(token, materialId) {
    return this.request(`/materials/${materialId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService();