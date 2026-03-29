import { registerUser, loginUser } from "@/models/authModel";
import type { User } from "@/types/user"

const extractApiErrorMessage = (err: unknown): string => {
    const apiError = err as any;
    const detail = apiError?.response?.data?.detail;

    if (typeof detail === "string") {
        return detail;
    }

    if (Array.isArray(detail)) {
        return detail
            .map((item) => item?.msg || item?.message)
            .filter(Boolean)
            .join(", ") || "Validation failed";
    }

    if (err instanceof Error) {
        return err.message;
    }

    return "An unknown error occurred";
};

export const handleRegister = async (
    formData: User,
    setLoading: (v: boolean) => void,
    setError: (msg: string) => void
) => {
    try {
        setLoading(true);
        setError("");
        return await registerUser(formData);
    } catch (err: unknown) {
        setError(extractApiErrorMessage(err));
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
        setError(extractApiErrorMessage(err));
    } finally {
        setLoading(false);
    }
};
