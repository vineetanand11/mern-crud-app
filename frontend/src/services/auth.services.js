import axios from "axios";

const API_URI = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URI
});

export const register = (data) => {
    return api.post('/auth/register', data);
}

export const login = (data) => {
    return api.post('/auth/login', data);
}
