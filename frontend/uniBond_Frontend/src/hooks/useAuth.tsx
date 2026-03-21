import { useState, type ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { User } from "@/types/user";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? (JSON.parse(savedUser) as User) : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}