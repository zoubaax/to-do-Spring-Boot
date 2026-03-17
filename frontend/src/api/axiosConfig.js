import axios from 'axios';

/**
 * BEST PRACTICE: Centralized Axios Instance
 * This allows us to set the baseURL once and handle global settings 
 * like headers or interceptors in one place.
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // Uses env variable or fallback
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
