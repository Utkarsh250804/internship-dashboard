import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const tasksAPI = {
  getAll: (params) => api.get('/tasks/', { params }),
  create: (data) => api.post('/tasks/', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const reportsAPI = {
  getAll: () => api.get('/reports/'),
  getOne: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports/', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  addComment: (id, data) => api.post(`/reports/${id}/comments`, data),
  deleteComment: (id, commentId) => api.delete(`/reports/${id}/comments/${commentId}`),
}

export const analyticsAPI = {
  get: () => api.get('/analytics/'),
}

export const notificationsAPI = {
  getAll: () => api.get('/notifications/'),
  getCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
}

export const usersAPI = {
  getStudents: () => api.get('/users/students'),
  getAllStudents: () => api.get('/users/all-students'),
  assignStudent: (id) => api.put(`/users/assign/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
}

export default api
