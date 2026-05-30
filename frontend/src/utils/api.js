// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL:  "https://noteiq-backend-on66.onrender.com",
  withCredentials: true, // send cookies like refreshToken
});

console.log("Axios Base URL:", process.env.REACT_APP_API_URL);
// Token stored in memory or localStorage
let token = localStorage.getItem("token");

// Set token in header for all requests
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
            `https://noteiq-backend-on66.onrender.com/auth/refresh`,
          { withCredentials: true }
        );
        
        const newToken = res.data.token;
        localStorage.setItem("token", newToken);
        token = newToken;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        localStorage.removeItem("token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
