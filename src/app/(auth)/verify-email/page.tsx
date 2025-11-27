"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function EmailVerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("Memverifikasi email...");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Token tidak ditemukan.");
                setTimeout(() => router.push("/verify-failed"), 1500);
                return;
            }

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
                    { token }
                );

                toast.success("Email berhasil diverifikasi!");

                setStatus("success");
                setMessage("Email Anda sudah diverifikasi. Silakan login.");

                setTimeout(() => router.push("/login"), 1500);
            } catch (error: any) {
                setStatus("error");
                setMessage(
                    error?.response?.data?.message ||
                        "Verifikasi gagal. Token invalid atau expired."
                );
                toast.error("Verifikasi gagal!");
                setTimeout(() => router.push("/verify-failed"), 1500);
            }
        };

        verify();
    }, [token, router]);

    return (
        <main className="flex items-center justify-center min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-3">
                    {status === "loading" && (
                        <>
                            <CheckCircle className="w-10 h-10 text-teal-500 animate-spin" />
                            <p>{message}</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <CheckCircle className="w-10 h-10 text-teal-600" />
                            <p className="text-teal-700 font-semibold">
                                {message}
                            </p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <XCircle className="w-10 h-10 text-red-600" />
                            <p className="text-red-600">{message}</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
