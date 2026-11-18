const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(fullName, email, password, role = 'Director') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password, role })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, { headers: getAuthHeaders() });
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  // Dataset
  async getDatasetStatus() {
    const res = await fetch(`${API_BASE}/dataset/status`, { headers: getAuthHeaders() });
    return res.json();
  },

  async uploadDataset(formData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/dataset/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Dataset upload failed');
    }
    return res.json();
  },

  // Analytics
  async getKPIs() {
    const res = await fetch(`${API_BASE}/analytics/kpis`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    return res.json();
  },

  // Multi-Agent Orchestrator
  async runAgents(workflowType = 'Sequential-Hierarchical') {
    const res = await fetch(`${API_BASE}/agents/run`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ workflow_type: workflowType })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Agent execution failed');
    }
    return res.json();
  },

  async listAgentRuns() {
    const res = await fetch(`${API_BASE}/agents/runs`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getAgentLogs(runId) {
    const res = await fetch(`${API_BASE}/agents/runs/${runId}/logs`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Human-in-the-Loop Approvals
  async getApprovals(status = null) {
    const url = status ? `${API_BASE}/approvals?status_filter=${status}` : `${API_BASE}/approvals`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return res.json();
  },

  async recordApprovalDecision(id, decision, comment = '') {
    const res = await fetch(`${API_BASE}/approvals/${id}/decision`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ decision, comment })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to record decision');
    }
    return res.json();
  },

  // Multi-Agent Chat
  async sendChatMessage(message) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    return res.json();
  },

  async getChatHistory() {
    const res = await fetch(`${API_BASE}/chat/history`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Reports
  async listReports() {
    const res = await fetch(`${API_BASE}/reports`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getReport(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },

  getPdfDownloadUrl(id) {
    return `${API_BASE}/reports/${id}/pdf`;
  }
};
