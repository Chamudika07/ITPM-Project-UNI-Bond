import { useState } from "react";
import { handleLogin } from "@/controllers/authController";
import { useAuth } from "@/hook/useAuthHook";
import Input from "@/components/Input";


export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async () => {
        const res = await handleLogin(email, password, setError);
        if (res) {
            login(res.user);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold">Login</h2>

            <Input label="Email" name="email" onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} />

            <button onClick={onSubmit} className="bg-green-500 text-white p-2 mt-3">
                Login
            </button>

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}