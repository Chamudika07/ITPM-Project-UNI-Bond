import type { User } from "@/types/user";


const users: User[] = [];

export const mockRegister = (userData: User): Promise<{ message: string; user: User }> => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const exists = users.find((u) => u.email === userData.email);

            if (exists) {
                reject({ message: "User already exists" });
            } else {
                users.push(userData);
                // If it's a company, auto-add to the mock companies list
                if (userData.role === "company") {
                   const { mockAddCompany } = await import("@/services/mock/mockCompanyApi");
                   await mockAddCompany({
                       id: userData.id,
                       name: ("companyName" in userData) ? userData.companyName : "Unknown",
                       industry: ("industry" in userData) ? userData.industry : "Tech",
                       description: "A newly registered company on UNI-Bond.",
                       location: "Sri Lanka",
                   });
                }
                
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