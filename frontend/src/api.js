import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";


const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        const response = await axios.post(`${apiUrl}/userapi/token/refresh/`, { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem(ACCESS_TOKEN, access)
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (error) {
        localStorage.clear()
        console.error("Failed to refresh token:", error);
        return Promise.reject({
          message: "Sesja wygasła, zaloguj się ponownie!",
          originalError: error,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;