import { TUser } from "../types/user.types";
import { jwtDecode } from "jwt-decode";

export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const setToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const decodeToken = (token: string): TUser => {
    return jwtDecode(token);
};
