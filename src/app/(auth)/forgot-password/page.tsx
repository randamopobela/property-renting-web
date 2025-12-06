"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import API from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

const ForgotSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),
});

export default function ForgotPasswordPage() {
    const router = useRouter();

    const handleSubmit = async (values: any) => {
        try {
            await API.post("/auth/forgot-password", { email: values.email });
            toast.success("Email reset password telah dikirim!");
            router.push("/login"); // atau buat halaman khusus success
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Gagal mengirim email reset."
            );
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-teal-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-teal-100 p-4 rounded-full">
                            <Mail className="w-8 h-8 text-teal-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-teal-700 text-center mb-2">
                        Lupa Password
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                        Masukkan email Anda untuk menerima tautan reset
                        password.
                    </p>

                    <Formik
                        initialValues={{ email: "" }}
                        validationSchema={ForgotSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <Field
                                    as={Input}
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />

                                <Button
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Mengirim..."
                                        : "Kirim Email Reset"}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <p className="text-sm text-center mt-4">
                        Kembali ke{" "}
                        <a
                            href="/login"
                            className="text-teal-600 hover:underline"
                        >
                            halaman login
                        </a>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
