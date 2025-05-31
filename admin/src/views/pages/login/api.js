import axios from 'axios';

const api = axios.create({
    baseURL: "https://test1.3ding.in/api/auth/",
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);