import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

const api = axios.create({
    baseURL: API_URL,
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("moviemate_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration/unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("moviemate_token");
            localStorage.removeItem("moviemate_user");
            
            // Redirect to login if window is available
            if (typeof window !== "undefined" && window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;