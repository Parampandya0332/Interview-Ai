import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import {
    login,
    register,
    logout
} from "../services/auth.api.js";


export const useAuth = () => {
    const context = useContext(AuthContext);

    const {
        user,
        setUser,
        loading,
        setLoading,
        authError,
        setAuthError
    } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setAuthError("");

        try {
            const data = await login({ email, password });

            setUser(data.user);

            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError(error.response?.data?.message || "Unable to sign in. Check your connection and try again.");

            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        setAuthError("");

        try {
            const data = await register({
                username,
                email,
                password
            });

            setUser(data.user);

            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            setAuthError(error.response?.data?.message || "Unable to create your account. Check your connection and try again.");

            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    

    return {
        user,
        setUser,
        loading,
        setLoading,
        authError,
        handleLogin,
        handleRegister,
        handleLogout
    };
};
