"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { Mail, Loader2, LogIn } from "lucide-react";
import LoginWithGoogle from "@/components/auth/LoginWithGoogle";

const EmailOnlySchema = Yup.object().shape({
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),
});

export default function RegisterEmailPage() {
    const router = useRouter();

    const handleEmailRegister = async (values: any) => {
        try {
            await API.post("/auth/register", { email: values.email });

            toast.success("Email verifikasi telah dikirim!");
            router.push("/verify-sent");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Gagal melakukan pendaftaran."
            );
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-teal-50 px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                        <Mail className="w-10 h-10 text-teal-700" />
                    </div>

                    <h1 className="text-2xl font-bold text-teal-700 text-center mb-4">
                        Daftar dengan Email
                    </h1>

                    <Formik
                        initialValues={{ email: "" }}
                        validationSchema={EmailOnlySchema}
                        onSubmit={handleEmailRegister}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <Field
                                    as={Input}
                                    name="email"
                                    placeholder="Email kamu"
                                    type="email"
                                />
                                <ErrorMessage
                                    name="email"
                                    className="text-red-500 text-sm"
                                    component="p"
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-teal-600 text-white"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "Daftar Sekarang"
                                    )}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    {/* Google Login */}
                    <div className="my-4">
                        <LoginWithGoogle />
                    </div>

                    <p className="text-center text-sm mt-4">
                        Sudah punya akun?{" "}
                        <a href="/login" className="text-teal-600 underline">
                            Masuk
                        </a>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
