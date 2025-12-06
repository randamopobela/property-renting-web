"use client";

import { MailCheck, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function VerifySentPage() {
    const router = useRouter();

    return (
        <main className="flex items-center justify-center min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8 text-center">
                    {/* ICON */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-teal-100 p-4 rounded-full">
                            <MailCheck className="text-teal-600 w-10 h-10" />
                        </div>
                    </div>

                    {/* TITLE */}
                    <h1 className="text-2xl font-bold text-teal-700 mb-2">
                        Email Verifikasi Telah Dikirim!
                    </h1>

                    {/* TEXT */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Kami telah mengirimkan tautan verifikasi ke email Anda.
                        Silakan buka email tersebut untuk melanjutkan proses
                        aktivasi akun.
                    </p>

                    {/* GO TO EMAIL BUTTON */}
                    <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white mb-3"
                        onClick={() =>
                            window.open("https://mail.google.com", "_blank")
                        }
                    >
                        Buka Email Saya
                    </Button>

                    {/* RESEND VERIFICATION BUTTON */}
                    <Button
                        variant="outline"
                        className="w-full border-teal-300 text-teal-700 hover:bg-teal-50"
                        onClick={() => router.push("/resend-email")}
                    >
                        <RefreshCw size={16} className="mr-2" /> Kirim Ulang
                        Email Verifikasi
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
