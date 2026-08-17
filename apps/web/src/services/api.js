const API_BASE = 'http://localhost:5000/api';

export const api = {
  requestOtp: async (phoneNumber) => {
    const res = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    return res.json();
  },

  verifyOtp: async (phoneNumber, otp, fullName) => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp, fullName })
    });
    return res.json();
  },

  getNearbyTasks: async (lat = -1.2614, lng = 36.8028) => {
    const res = await fetch(`${API_BASE}/tasks/nearby?latitude=${lat}&longitude=${lng}&maxDistanceKm=20`);
    return res.json();
  },

  createTask: async (taskData) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return res.json();
  }
};