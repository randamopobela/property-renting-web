"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md"
        >
            <LogOut size={18} />
            Logout
        </button>
    );
}
