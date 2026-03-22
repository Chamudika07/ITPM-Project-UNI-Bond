import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { User } from "@/types/user";
import apiClient from "@/services/api/axiosClient";

const mapUser = (data: any): User => ({
    ...data,
    id: String(data.id),
    firstname: data.first_name || data.firstname || "User",
    lastname: data.last_name || data.lastname || "",
    email: data.email,
    role: data.role
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await apiClient.get("/users/me");
                    setUser(mapUser(res.data));
                } catch (err) {
                    console.error("Failed to restore session", err);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (userData: any, token: string) => {
        setUser(mapUser(userData));
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    if (loading) return null; // Or a nice Loader depending on app design

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}