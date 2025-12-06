import axios from "axios";
import { getSession } from "next-auth/react";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:8000/api",
});

// Interceptor untuk Authorization otomatis => pakai JWT dari NextAuth session
API.interceptors.request.use(async (config) => {
    const session = await getSession();
    const accessToken = (session as any)?.user?.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export default API;
