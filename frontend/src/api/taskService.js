import apiClient from './axiosConfig';

/**
 * BEST PRACTICE: Service Pattern
 * Separating API calls from UI logic (the React components).
 * This makes the code reusable and easier to test.
 */
export const TaskService = {
  // Fetch all tasks from the backend
  getTasks: async () => {
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
