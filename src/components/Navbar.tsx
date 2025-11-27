"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function NavbarComponent() {
    const { data: session, status } = useSession();
    const user = session?.user as any;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`w-full fixed px-6 py-3 flex items-center justify-between top-0 z-50 transition-all ${
                scrolled
                    ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200"
                    : "bg-transparent dark:bg-transparent"
            }`}
        >
            <Link href="/" className="font-bold text-teal-700 text-xl">
                StayEase
            </Link>

            <div className="flex items-center gap-4">
                {/* Link umum */}
                <Link
                    href="/properties"
                    className="text-sm hover:text-teal-700"
                >
                    Properti
                </Link>

                {user?.role === "TENANT" && (
                    <Link
                        href="/tenant/dashboard"
                        className="text-sm hover:text-teal-700"
                    >
                        Dashboard Tenant
                    </Link>
                )}

                {status === "loading" && (
                    <span className="text-sm text-gray-500">Memuat...</span>
                )}

                {status === "unauthenticated" && (
                    <>
                        <Link href="/login">
                            <Button variant="outline" size="sm">
                                Masuk
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                                Daftar
                            </Button>
                        </Link>
                    </>
                )}

                {status === "authenticated" && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700">
                            Hi, {user?.firstName}{" "}
                            <span className="text-xs text-gray-500">
                                ({user?.role})
                            </span>
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
