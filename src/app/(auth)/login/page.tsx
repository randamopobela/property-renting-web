"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeClosed } from "lucide-react";

const SignInSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email harus diisi"),
    password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .matches(/[a-z]/, "Password harus mengandung huruf kecil")
        .matches(/[A-Z]/, "Password harus mengandung huruf besar")
        .matches(/[0-9]/, "Password harus mengandung angka")
        .required("Password harus diisi"),
});

export default function LoginPage() {
    const router = useRouter();
    const { user, login, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            await login(values.email, values.password);
            toast.success("Login berhasil!");
            router.push("/");
        } catch (error: any) {
            //Menghandle error saat registrasi
            toast.error(
                `Login gagal! Periksa kembali email dan password Anda. ${error.message}`
            );
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-teal-50">
            <Card className="w-full max-w-md border-0 shadow-lg bg-white/90 backdrop-blur-md">
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">
                        Masuk
                    </h2>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={SignInSchema}
                        onSubmit={handleLogin}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <Field
                                        name="email"
                                        as={Input}
                                        placeholder="Email"
                                        type="email"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="p"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="relative">
                                        <Field
                                            name="password"
                                            as={Input}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Password"
                                            className="pr-10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                        >
                                            {showPassword ? (
                                                <Eye size={18} />
                                            ) : (
                                                <EyeClosed size={18} />
                                            )}
                                        </button>
                                    </div>

                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div className="text-right">
                                    <a
                                        href="/forgot-password"
                                        className="text-teal-600 text-sm hover:underline"
                                    >
                                        Lupa password?
                                    </a>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    {isSubmitting ? "Memproses..." : "Masuk"}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <p className="text-center text-sm mt-4">
                        Belum punya akun?{" "}
                        <a
                            href="/register"
                            className="text-teal-600 hover:underline"
                        >
                            Daftar
                        </a>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
