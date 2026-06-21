import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("moviemate_user");
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    
    const [token, setToken] = useState(() => localStorage.getItem("moviemate_token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const savedToken = localStorage.getItem("moviemate_token");
            if (savedToken) {
                try {
                    // Call the GET /user endpoint to verify the session is active
                    const response = await api.get("/user");
                    setUser(response.data);
                } catch (error) {
                    console.error("Session verification failed", error);
                    // Interceptor handles clearing, but double check just in case
                    handleSessionCleanup();
                }
            } else {
                handleSessionCleanup();
            }
            setLoading(false);
        };

        verifySession();
    }, []);

    const handleSessionCleanup = () => {
        localStorage.removeItem("moviemate_token");
        localStorage.removeItem("moviemate_user");
        setUser(null);
        setToken(null);
    };

    const login = async (email, password) => {
        try {
            const response = await api.post("/login", { email, password });
            const { token: resToken, user: resUser } = response.data;
            
            localStorage.setItem("moviemate_token", resToken);
            localStorage.setItem("moviemate_user", JSON.stringify(resUser));
            
            setToken(resToken);
            setUser(resUser);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || "Login failed. Please check credentials.";
            return { success: false, error: message };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await api.post("/signup", { username, email, password });
            const { token: resToken, user: resUser } = response.data;
            
            localStorage.setItem("moviemate_token", resToken);
            localStorage.setItem("moviemate_user", JSON.stringify(resUser));
            
            setToken(resToken);
            setUser(resUser);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || "Signup failed. Please try again.";
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Server logout error", error);
        } finally {
            handleSessionCleanup();
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
