import axios from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "../context/authContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        const res = await api.get("/api/users/refresh-token", { withCredentials: true });

        if (!res.data?.accessToken) {
          setStoredAccessToken(null);
          return Promise.reject(error);
        }

        setStoredAccessToken(res.data.accessToken);
        originalReq.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalReq);
      } catch (err) {
        setStoredAccessToken(null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
