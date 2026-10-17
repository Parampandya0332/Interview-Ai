import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL || "/api/auth";
const normalizedApiUrl = configuredApiUrl.replace(/\/$/, "");
const authApiUrl = normalizedApiUrl.endsWith("/api/auth")
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api/auth`;

const api = axios.create({
    // Set VITE_API_URL to the deployed backend origin (or full /api/auth URL).
    // The relative fallback keeps same-origin deployments working.
    baseURL: authApiUrl,
    withCredentials: true,
});


export async function register({username, email, password}) {
    try{
        const response = await api.post("/register", {username, email, password})
        return response.data;
    }catch(error){
        console.log("Error during registration:", error);
        throw error;
    }
}

export async function login({email, password}) {
    try{
        const response = await api.post("/login", {email, password})
        return response.data;
    }catch(error){
        console.log("Error during login:", error);
        throw error;
    }   
}

export async function logout() {
    try{
        const response = await api.get("/logout")
        return response.data;
    }catch(error){
        console.log("Error during logout:", error);
        throw error;
    }   
}

export async function getME() {
    try{
        const response = await api.get("/get-me")
        return response.data;
    }catch(error){
        console.log("Error fetching current user:", error);
        throw error;
    }
}
