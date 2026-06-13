const API_URL = 'http://localhost:5000/api';

// Helper function for fetch requests
const fetchRequest = async (endpoint, method, token, data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong');
  }
  
  return result;
};

// Auth services
export const register = (userData) => 
  fetchRequest('/auth/register', 'POST', null, userData);

export const login = (userData) => 
  fetchRequest('/auth/login', 'POST', null, userData);

// Task services (require token)
export const getTasks = (token) => 
  fetchRequest('/tasks', 'GET', token);

export const createTask = (token, taskData) => 
  fetchRequest('/tasks', 'POST', token, taskData);

export const updateTask = (token, taskId, taskData) => 
  fetchRequest(`/tasks/${taskId}`, 'PUT', token, taskData);

export const deleteTask = (token, taskId) => 
  fetchRequest(`/tasks/${taskId}`, 'DELETE', token);

export const updateTaskPositions = (token, tasks) => 
  fetchRequest('/tasks/position', 'PUT', token, { tasks });