import axios from 'axios';

const hostname = window.location.hostname;
const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';
const api = axios.create({
  baseURL: isLocalDev ? 'http://localhost:3001/api' : '/api',
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  // Auth
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  register(credentials) {
    return api.post('/auth/register', credentials);
  },

  // User
  updateAvatar(avatar) {
    return api.put('/user/avatar', { avatar });
  },

  // Schedules
  getSchedules() {
    return api.get('/schedules');
  },
  createSchedule(schedule) {
    return api.post('/schedules', schedule);
  },
  deleteSchedule(id) {
    return api.delete(`/schedules/${id}`);
  },

  // Workouts
  getWorkouts() {
    return api.get('/workouts');
  },
  getWorkout(id) {
    return api.get(`/workouts/${id}`);
  },
  saveWorkout(workout) {
    return api.post('/workouts', workout);
  },
  updateWorkout(id, workout) {
    return api.put(`/workouts/${id}`, workout);
  },
  deleteWorkout(id) {
    return api.delete(`/workouts/${id}`);
  }
};
