"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginWithGoogle() {
    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50 transition"
        >
            <FcGoogle size={22} />
            <span>Masuk dengan Google</span>
        </button>
    );
}
