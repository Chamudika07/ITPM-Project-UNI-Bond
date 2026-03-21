import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleRegister } from "@/controllers/authController";
import Input from "@/components/Input";
import RoleSelector from "@/components/RoleSelector";
import Select from "@/components/Select";
import type { Role, User } from "@/types/user";
import { ROUTES } from "@/utils/constants";

const educationOptions = [
    { value: "", label: "Select Education Level..." },
    { value: "Diploma", label: "Diploma" },
    { value: "Higher Diploma", label: "Higher Diploma" },
    { value: "Bachelor", label: "Bachelor" },
    { value: "Master", label: "Master" },
];

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState<Partial<User>>({ role: "student" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError("");
        setSuccess("");
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = (): boolean => {
        const requiredFields: string[] = ["firstname", "lastname", "email", "password", "role"];

        switch (form.role) {
            case "student":
                requiredFields.push("studentID", "education");
                break;
            case "lecturer":
                requiredFields.push("lecturerUsername", "education");
                break;
            case "company":
                requiredFields.push("companyName", "industry", "companySize");
                break;
            case "tech_lead":
                requiredFields.push("industryExpertise", "yearsOfExperience");
                break;
        }

        for (const field of requiredFields) {
            if (!(form as Record<string, string | undefined>)[field]) {
                setError(`Field '${field}' is required.`);
                return false;
            }
        }
        return true;
    }

    const onSubmit = async () => {
        setError("");
        setSuccess("");
        if (!validateForm()) {
            return;
        }
        const res = await handleRegister(form as User, setLoading, setError);
        if (res) {
            setSuccess(res.message);
            setForm({ role: form.role }); // Reset form but keep role
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold">Register</h2>

            <RoleSelector value={form.role as Role} onChange={handleChange} />

            <Input label="First Name" name="firstname" onChange={handleChange} />
            <Input label="Last Name" name="lastname" onChange={handleChange} />
            <Input label="Email" name="email" onChange={handleChange} />
            <Input label="Password" name="password" type="password" onChange={handleChange} />

            {form.role === "student" && (
                <>
                    <Input label="Student ID" name="studentID" onChange={handleChange} />
                    <Select
                        label="Education"
                        name="education"
                        value={form.education || ""}
                        onChange={handleChange}
                        options={educationOptions}
                    />
                </>
            )}

            {form.role === "lecturer" && (
                <>
                    <Input label="Lecturer Username" name="lecturerUsername" onChange={handleChange} />
                    <Select
                        label="Education"
                        name="education"
                        value={form.education || ""}
                        onChange={handleChange}
                        options={educationOptions}
                    />
                </>
            )}

            {form.role === "company" && (
                <>
                    <Input label="Company Name" name="companyName" onChange={handleChange} />
                    <Input label="Industry" name="industry" onChange={handleChange} />
                    <Input label="Company Size" name="companySize" onChange={handleChange} />
                </>
            )}

            {form.role === "tech_lead" && (
                <>
                    <Input label="Industry Expertise" name="industryExpertise" onChange={handleChange} />
                    <Input label="Years Of Experience" name="yearsOfExperience" type="number" onChange={handleChange} />
                </>
            )}

            <button onClick={onSubmit} disabled={loading} className="bg-blue-500 text-white p-2 mt-4 w-full disabled:opacity-50">
                {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-sm mt-3 text-center">
                Already have an account?{" "}
                <button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="text-blue-500 hover:underline"
                >
                    Login here
                </button>
            </p>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
    );
}