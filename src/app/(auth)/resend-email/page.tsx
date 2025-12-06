"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import API from "@/lib/axiosInstance"; // sesuaikan dengan konfigurasi projek kamu
import { Mail } from "lucide-react";
import axios from "axios";

const ResendSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),
});

export default function ResendVerificationPage() {
    const router = useRouter();

    const handleResend = async (values: { email: string }) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-email`,
                { email: values.email }
            );

            toast.success(
                res.data?.message || "Email verifikasi telah dikirim ulang!"
            );

            setTimeout(() => {
                router.push("/verify-sent");
            }, 1500);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    "Gagal mengirim ulang email verifikasi."
            );
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white px-4">
            <Card className="w-full max-w-md border-0 shadow-lg bg-white/90 backdrop-blur-md">
                <CardContent className="p-8">
                    {/* ICON */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-teal-100 p-4 rounded-full">
                            <Mail className="text-teal-600 w-8 h-8" />
                        </div>
                    </div>

                    {/* TITLE */}
                    <h1 className="text-2xl font-bold text-teal-700 text-center mb-2">
                        Kirim Ulang Email Verifikasi
                    </h1>

                    <p className="text-gray-600 text-center mb-6">
                        Masukkan email Anda untuk menerima ulang tautan
                        verifikasi.
                    </p>

                    {/* FORM */}
                    <Formik
                        initialValues={{ email: "" }}
                        validationSchema={ResendSchema}
                        onSubmit={handleResend}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                {/* EMAIL INPUT */}
                                <div>
                                    <Field
                                        as={Input}
                                        name="email"
                                        type="email"
                                        placeholder="Email Anda"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* BUTTON */}
                                <Button
                                    type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Mengirim..."
                                        : "Kirim Ulang Email Verifikasi"}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    {/* Back to login */}
                    <p className="text-sm text-center mt-4">
                        Sudah diverifikasi?{" "}
                        <a
                            href="/login"
                            className="text-teal-600 hover:underline"
                        >
                            Masuk ke akun
                        </a>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
