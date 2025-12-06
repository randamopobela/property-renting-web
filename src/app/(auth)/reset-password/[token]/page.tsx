"use client";

import { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Lock } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";

const ResetSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Minimal 8 karakter")
        .matches(/[a-z]/, "Harus mengandung huruf kecil")
        .matches(/[A-Z]/, "Harus mengandung huruf besar")
        .matches(/[0-9]/, "Harus mengandung angka")
        .required("Password wajib diisi"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password tidak cocok")
        .required("Konfirmasi password wajib diisi"),
});

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { token } = useParams();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                token,
                newPassword: values.password,
            };

            await API.post("/auth/reset-password", payload);

            toast.success("Password berhasil direset! Silakan login.");
            router.push("/login");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Gagal reset password."
            );
            router.push("/forgot-password");
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-teal-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-teal-100 p-4 rounded-full">
                            <Lock className="w-8 h-8 text-teal-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-teal-700 text-center mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                        Masukkan password baru Anda.
                    </p>

                    <Formik
                        initialValues={{ password: "", confirmPassword: "" }}
                        validationSchema={ResetSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                {/* Password */}
                                <div className="relative">
                                    <Field
                                        name="password"
                                        as={Input}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Password baru"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        onClick={() =>
                                            setShowPassword((p) => !p)
                                        }
                                    >
                                        {showPassword ? <Eye /> : <EyeClosed />}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                {/* Confirm Password */}
                                <div className="relative">
                                    <Field
                                        name="confirmPassword"
                                        as={Input}
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Konfirmasi password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        onClick={() =>
                                            setShowConfirmPassword((p) => !p)
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <Eye />
                                        ) : (
                                            <EyeClosed />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Button
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Memproses..."
                                        : "Reset Password"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </main>
    );
}
