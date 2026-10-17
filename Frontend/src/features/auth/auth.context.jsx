import { createContext, useState } from "react";
import { useEffect } from "react";
import { getME } from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authInitialized, setAuthInitialized] = useState(true);
    useEffect(() => {
        const getAndsetUser = async () => {
            try {
                const data = await getME();
                setUser(data.user);
            } catch (error) {
                // 401 aana normal hai jab user logged in nahi hai
                setUser(null);
            } finally {
                setLoading(false); // ab ye HAMESHA chalega, chahe error aaye ya na aaye
            }
        }
        getAndsetUser();
    }, []);

    

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                authInitialized
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};