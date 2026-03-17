import apiClient from './axiosConfig';

const authService = {
    login: async (username, password) => {
        const response = await apiClient.post('/auth/login', { username, password });
        return response.data;
    },
    signup: async (username, password) => {
        const response = await apiClient.post('/auth/signup', { username, password });
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
};

export default authService;
