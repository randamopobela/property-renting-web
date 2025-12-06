"use client";

import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function VerifyFailedPage() {
    const router = useRouter();

    return (
        <main className="flex items-center justify-center min-h-screen bg-red-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="bg-red-100 p-4 rounded-full mb-4">
                        <XCircle className="text-red-600 w-10 h-10" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-red-700 mb-2">
                        Verifikasi Gagal
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Token tidak valid atau sudah kedaluwarsa. Silakan minta
                        ulang tautan verifikasi.
                    </p>

                    {/* Button: Resend Verification */}
                    <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white mb-3"
                        onClick={() => router.push("/resend-email")}
                    >
                        Kirim Ulang Email Verifikasi
                    </Button>

                    {/* Button: Back to Login */}
                    <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-700 hover:bg-red-100"
                        onClick={() => router.push("/login")}
                    >
                        Kembali ke Login
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
