import type { User } from "@/types/user";

export const getStoredUsers = (): User[] => {
    const stored = localStorage.getItem('mock_users');
    return stored ? JSON.parse(stored) : [];
};

export const saveUsers = (u: User[]) => {
    localStorage.setItem('mock_users', JSON.stringify(u));
};

export const mockRegister = (userData: User): Promise<{ message: string; user: User }> => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const users = getStoredUsers();
            const exists = users.find((u) => u.email === userData.email);

            if (exists) {
                reject({ message: "User already exists" });
            } else {
                users.push(userData);
                saveUsers(users);
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
            const users = getStoredUsers();
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

export const mockGetTopStudents = async (): Promise<(User & { rating: number })[]> => {
    const users = getStoredUsers();
    const students = users.filter(u => u.role === "student");
    const ratedStudents = students.map(s => ({
        ...s,
        rating: Number((Math.random() * 2 + 3).toFixed(1)) // random rating between 3.0 and 5.0
    })).sort((a, b) => b.rating - a.rating);
    
    // If no students exist, return some mock default students
    if (ratedStudents.length === 0) {
        return Array.from({ length: 5 }).map((_, i) => ({
            id: 'mock-stu-' + i,
            firstname: 'Top',
            lastname: 'Student ' + (i+1),
            email: 'top.student' + i + '@uni-bond.com',
            password: 'mock',
            role: 'student' as const,
            studentID: 'IT' + (100000 + i),
            education: 'Bachelor' as const,
            rating: 4.9 - (i * 0.1)
        }));
    }
    
    return ratedStudents.slice(0, 10);
};