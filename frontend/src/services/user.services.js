import axios from "axios";

const API_URI = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URI
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllUsers = () => {
    return api.get('/users/');
} 

export const getUserById = (userId) => {
    return api.get(`/users/${userId}`);
}

export const updateUser = (id, data) => {
    return api.put(`/users/${id}`, data);
}

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
}
