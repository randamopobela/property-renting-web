"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";

// VALIDATION SCHEMA
const CompleteProfileSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "Minimal 2 karakter")
        .required("Nama depan wajib diisi"),
    lastName: Yup.string().nullable(),
    phone: Yup.string()
        .nullable()
        .matches(/^[0-9]+$/, "Nomor telepon hanya boleh angka"),
    address: Yup.string().nullable(),
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

export default function VerifyCompleteProfilePage({
    params,
}: {
    params: { token: string };
}) {
    const router = useRouter();
    // const searchParams = useSearchParams();
    const { token } = useParams();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleCompleteProfile = async (values: any) => {
        try {
            const payload = {
                token,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                address: values.address,
                password: values.password,
            };

            await API.post("/auth/verify-email", payload);

            toast.success(
                "Akun berhasil diverifikasi & data lengkap disimpan!"
            );
            router.push("/login");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    "Gagal menyelesaikan verifikasi."
            );

            router.push("/verify-failed");
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-teal-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8">
                    <h1 className="text-2xl font-bold text-teal-700 text-center mb-4">
                        Lengkapi Profil Anda
                    </h1>

                    <p className="text-gray-600 text-center mb-6">
                        Silakan lengkapi data berikut untuk menyelesaikan
                        verifikasi akun.
                    </p>

                    <Formik
                        initialValues={{
                            firstName: "",
                            lastName: "",
                            phone: "",
                            address: "",
                            password: "",
                            confirmPassword: "",
                        }}
                        validationSchema={CompleteProfileSchema}
                        onSubmit={handleCompleteProfile}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <Field
                                    as={Input}
                                    name="firstName"
                                    placeholder="Nama depan"
                                />
                                <ErrorMessage
                                    name="firstName"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Field
                                    as={Input}
                                    name="lastName"
                                    placeholder="Nama belakang (opsional)"
                                />
                                <ErrorMessage
                                    name="lastName"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Field
                                    as={Input}
                                    name="phone"
                                    placeholder="Nomor HP (opsional)"
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Field
                                    as={Input}
                                    name="address"
                                    placeholder="Alamat (opsional)"
                                />
                                <ErrorMessage
                                    name="address"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                {/* Password */}
                                <div className="relative">
                                    <Field
                                        as={Input}
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Password baru"
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
                                        as={Input}
                                        name="confirmPassword"
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

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    {isSubmitting
                                        ? "Memproses..."
                                        : "Submit Data & Verifikasi Akun"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </main>
    );
}
