import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "@/controllers/authController";
import { useAuth } from "@/hook/useAuthHook";
import Input from "@/components/Input";
import { ROUTES } from "@/utils/constants";


export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        const res = await handleLogin(email, password, setLoading, setError);
        if (res) {
            login(res.user);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Login</h2>

            <Input label="Email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <Input label="Password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />

            <button onClick={onSubmit} disabled={loading} className="bg-green-500 text-white p-2 mt-3 w-full disabled:opacity-50">
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

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}