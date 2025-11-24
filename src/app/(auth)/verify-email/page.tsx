"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import API from "@/lib/axiosInstance"; // sesuaikan dengan axios config milikmu

export default function EmailVerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const token = searchParams.get("token");

    const handleVerify = async () => {
        if (!token) {
            toast.error("Token tidak tersedia atau link tidak valid.");
            router.push("/verify-failed");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/verify-email", {
                token,
            });

            toast.success(
                response.data?.message || "Email berhasil diverifikasi!"
            );

            setTimeout(() => {
                router.push("/login");
            }, 1200);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    "Verifikasi gagal. Token tidak valid atau sudah kedaluwarsa."
            );

            setTimeout(() => {
                router.push("/verify-failed");
            }, 1200);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8 flex flex-col items-center text-center">
                    {/* ICON */}
                    <div className="bg-teal-100 p-4 rounded-full mb-4">
                        <CheckCircle className="text-teal-600 w-10 h-10" />
                    </div>

                    {/* TITLE */}
                    <h1 className="text-2xl font-bold text-teal-700 mb-2">
                        Verifikasi Email
                    </h1>

                    {/* SUBTEXT */}
                    <p className="text-gray-600 mb-6">
                        Klik tombol di bawah untuk menyelesaikan proses
                        verifikasi email Anda.
                    </p>

                    {/* VERIFY BUTTON */}
                    <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white w-full"
                        disabled={loading}
                        onClick={handleVerify}
                    >
                        {loading ? "Memverifikasi..." : "Verify Email"}
                    </Button>

                    {/* Token Debug (opsional) */}
                    {/* <p className="text-xs text-gray-400 mt-4">Token: {token}</p> */}
                </CardContent>
            </Card>
        </main>
    );
}
