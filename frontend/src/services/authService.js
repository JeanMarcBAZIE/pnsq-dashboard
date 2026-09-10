import apiClient from './apiClient';

export const loginUser = async (username, password) => {
    try {
        const response = await apiClient.post('/accounts/login/', { username, password });
        return response.data;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

export const logoutUser = async (refreshToken) => {
    try {
        if (refreshToken) {
            await apiClient.post('/accounts/logout/', { refresh: refreshToken });
        }
        return true;
    } catch (error) {
        console.error('Logout API error:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/accounts/me/');
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};