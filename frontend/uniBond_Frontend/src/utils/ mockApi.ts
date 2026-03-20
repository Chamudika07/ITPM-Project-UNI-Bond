import type { User } from "../types/ user";


const users: User[] = [];

export const mockRegister = (userData: User): Promise<{ message: string; user: User }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const exists = users.find((u) => u.email === userData.email);

            if (exists) {
                reject({ message: "User already exists" });
            } else {
                users.push(userData);
                resolve({ message: "Registration successful", user: userData });
            }
        }, 1000);
    });
};

export const mockLogin = (email: string, password: string) => {
    return new Promise<{ message: string; user: User }>((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(
                (u) => u.email === email && u.password === password
            );

            if (user) {
                resolve({ message: "Login success", user });
            } else {
                reject({ message: "Invalid credentials" });
            }
        }, 1000);
    });
};