"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { TUser } from "../types/user.types";
import API from "../lib/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { decodeToken, getToken, removeToken, setToken } from "../utils/auth";

interface AuthContextType {
    user: TUser | null;
    login: (email: string, password: string) => Promise<void>;
    updateUser: (newUser: TUser) => void;
    // register: (data: UserRegister) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<TUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mengambil data user dari localStorage setelah refresh halaman jika ada,
        // agar tidak perlu login lagi.
        const token = getToken();
        if (token) {
            const userDecoded: TUser = jwtDecode(token);
            setUser(userDecoded);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await API.post(
                "/auth/login",
                { email, password }
                // { withCredentials: true } // opsional, kalau backend pakai cookie
            );

            API.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data?.data?.token}`;

            // Menyimpan token dari response.data.data ke dalam localStorage
            const userToken = response.data?.data?.token;
            setToken(userToken);

            // Mengambil data user dari token
            const userDecoded = decodeToken(userToken);
            setUser(userDecoded);
        } catch (error: any) {
            const message = error.response?.data?.message;
            throw new Error(message);
        }
    };

    const updateUser = (newUser: TUser) => setUser(newUser);

    const logout = () => {
        setUser(null);
        removeToken();
    };

    return (
        <AuthContext.Provider
            value={{ user, login, updateUser, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
