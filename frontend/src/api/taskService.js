import apiClient from './axiosConfig';

const taskService = {
  // Fetch all tasks from the backend
  getAllTasks: async () => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  // Add a new task
  createTask: async (task) => {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id, task) => {
    const response = await apiClient.put(`/tasks/${id}`, task);
    return response.data;
  },

  // Delete a task by ID
  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default taskService;
