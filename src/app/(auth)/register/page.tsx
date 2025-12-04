"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import API from "@/lib/axiosInstance";

const SignUpSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "Nama depan minimal 2 karakter")
        .required("Nama depan harus diisi"),
    lastName: Yup.string().nullable(),
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email harus diisi"),
    phone: Yup.string()
        .nullable()
        .matches(/^[0-9]+$/, "Nomor telepon hanya boleh angka")
        .min(10, "Nomor telepon minimal 10 digit"),
    password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .matches(/[a-z]/, "Harus mengandung huruf kecil")
        .matches(/[A-Z]/, "Harus mengandung huruf besar")
        .matches(/[0-9]/, "Harus mengandung angka")
        .required("Password harus diisi"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password tidak cocok")
        .required("Konfirmasi password harus diisi"),
    agreeToTerms: Yup.boolean().oneOf(
        [true],
        "Anda harus menyetujui syarat dan ketentuan"
    ),
});

export default function RegisterPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (session) router.push("/");
    }, [session, router]);

    const handleRegister = async (values: any) => {
        try {
            const { confirmPassword, agreeToTerms, ...payload } = values;

            await API.post("/auth/register", payload);

            toast.success("Registrasi berhasil! Cek email untuk verifikasi.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Terjadi kesalahan.");
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-teal-50">
            <Card className="w-full max-w-md border-0 shadow-lg bg-white/90 backdrop-blur-md">
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">
                        Daftar Akun Baru
                    </h2>

                    <Formik
                        initialValues={{
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            password: "",
                            confirmPassword: "",
                            agreeToTerms: false,
                        }}
                        validationSchema={SignUpSchema}
                        onSubmit={handleRegister}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form className="space-y-4">
                                <Field
                                    name="firstName"
                                    as={Input}
                                    placeholder="Nama depan"
                                />
                                <ErrorMessage
                                    name="firstName"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Field
                                    name="lastName"
                                    as={Input}
                                    placeholder="Nama belakang (opsional)"
                                />
                                <ErrorMessage
                                    name="lastName"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Field
                                    name="email"
                                    type="email"
                                    as={Input}
                                    placeholder="Email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Field
                                    name="phone"
                                    as={Input}
                                    placeholder="Nomor HP (opsional)"
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                {/* Password */}
                                <div className="relative">
                                    <Field
                                        name="password"
                                        as={Input}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((p) => !p)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
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
                                        onClick={() =>
                                            setShowConfirmPassword((p) => !p)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        {showConfirmPassword ? (
                                            <Eye size={18} />
                                        ) : (
                                            <EyeClosed size={18} />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                {/* Terms */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="agreeToTerms"
                                        onCheckedChange={(val) =>
                                            setFieldValue(
                                                "agreeToTerms",
                                                Boolean(val)
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="agreeToTerms"
                                        className="text-sm cursor-pointer"
                                    >
                                        Saya menyetujui syarat & ketentuan
                                    </label>
                                </div>
                                <ErrorMessage
                                    name="agreeToTerms"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-teal-600"
                                >
                                    {isSubmitting ? "Memproses..." : "Daftar"}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <p className="text-sm text-center mt-4">
                        Sudah punya akun?{" "}
                        <a
                            href="/login"
                            className="text-teal-600 hover:underline"
                        >
                            Masuk
                        </a>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
