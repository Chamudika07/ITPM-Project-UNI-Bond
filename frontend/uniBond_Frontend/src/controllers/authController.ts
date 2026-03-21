import { registerUser, loginUser } from "@/models/authModel";
import type { User } from "@/types/user"

export const handleRegister = async (
    formData: User,
    setLoading: (v: boolean) => void,
    setError: (msg: string) => void
) => {
    try {
        setLoading(true);
        return await registerUser(formData);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
    } finally {
        setLoading(false);
    }
};

export const handleLogin = async (
    email: string,
    password: string,
    setLoading: (v: boolean) => void,
    setError: (msg: string) => void
) => {
    try {
        setLoading(true);
        setError("");
        return await loginUser(email, password);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
    } finally {
        setLoading(false);
    }
};