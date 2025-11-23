import axios from "axios";

const API = axios.create({
  // 👇 HAPUS process.env, PAKAI HARDCODE DULU BIAR YAKIN
  // Pastikan port-nya 8000 (atau sesuai terminal backend Anda)
  baseURL: "http://localhost:8000/api", 
});

// Interceptor untuk Authorization otomatis
API.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    }

    return config;
});

export default API;
