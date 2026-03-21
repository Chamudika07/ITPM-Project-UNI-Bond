import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import RoleSelector from "@/components/RoleSelector";
import type { Role, User } from "@/types/user";
import { ROUTES } from "@/utils/constants";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState<Role>("student");

    const onSubmit = () => {
        let dummyUser: User;
        const baseUser = {
            id: "u-" + Math.random().toString(36).substring(2, 9),
            firstname: "Dummy",
            lastname: "User",
            email: "dummy@example.com",
            password: "password123",
        };

        switch (role) {
            case "student":
                dummyUser = { ...baseUser, role: "student", studentID: "STU001", education: "Bachelor" };
                break;
            case "lecturer":
                dummyUser = { ...baseUser, role: "lecturer", lecturerUsername: "lec_dummy", education: "Master" };
                break;
            case "company":
                dummyUser = { ...baseUser, role: "company", companyName: "Dummy Corp", industry: "IT", companySize: "100-500" };
                break;
            case "tech_lead":
                dummyUser = { ...baseUser, role: "tech_lead", industryExpertise: "Software Engineering", yearsOfExperience: "10" };
                break;
            case "admin":
                dummyUser = { ...baseUser, role: "admin", adminLevel: "SuperAdmin" };
                break;
            default:
                dummyUser = { ...baseUser, role: "student", studentID: "STU001", education: "Bachelor" };
        }

        login(dummyUser);
        navigate("/");
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Login (Mock Mode)</h2>
            <p className="text-sm text-gray-500 mb-4">Select a role below to instantly log in with dummy data.</p>

            <RoleSelector value={role} onChange={(e) => setRole(e.target.value as Role)} />

            <button onClick={onSubmit} className="bg-green-500 text-white p-2 mt-3 w-full hover:bg-green-600 transition rounded">
                Mock Login as {role}
            </button>

            <p className="text-sm mt-3 text-center">
                Don't have an account?{" "}
                <button
                    onClick={() => navigate(ROUTES.REGISTER)}
                    className="text-blue-500 hover:underline"
                >
                    Register here
                </button>
            </p>
        </div>
    );
}