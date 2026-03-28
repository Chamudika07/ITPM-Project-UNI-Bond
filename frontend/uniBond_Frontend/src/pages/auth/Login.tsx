import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { ROUTES } from "@/utils/constants";
import apiClient from "@/services/api/axiosClient";
import Input from "@/components/Input";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        setError("");
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append("username", email); // FastAPI OAuth2 expects 'username' field, which is email here
            formData.append("password", password);

            const res = await apiClient.post("/users/login", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });
            const token = res.data.access_token;
            
            const userRes = await apiClient.get("/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            login(userRes.data, token);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <div className="flex flex-col gap-4">
                <Input 
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <Input 
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <button onClick={onSubmit} disabled={loading} className="bg-green-500 text-white p-2 mt-4 w-full hover:bg-green-600 transition rounded disabled:opacity-50">
                {loading ? "Logging in..." : "Login"}
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