import axios from "axios";
import { ACCESS_KEY_TOKEN } from "./constants";


const getAuthToken = () => {
  return localStorage.getItem(ACCESS_KEY_TOKEN);
};

const apiConn = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

apiConn.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

apiConn.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiConn