// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        // Bisa tambahkan logging di sini kalau mau
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Jika belum login → langsung blok untuk route yang dimatch oleh matcher
                if (!token) return false;

                const user = token.user as any;
                const role = user?.role;

                // Role-based rules
                if (pathname.startsWith("/tenant")) {
                    return role === "TENANT";
                }

                if (pathname.startsWith("/admin")) {
                    return role === "ADMIN";
                }

                // Halaman lain yang dilindungi (matcher di bawah) → cukup butuh login
                return true;
            },
        },
    }
);

// Tentukan route mana yang butuh login:
export const config = {
    matcher: [
        "/profile/:path*",
        "/wishlist/:path*",
        "/bookings/:path*",
        "/tenant/:path*",
        "/properties/:path*",
        "/admin/:path*",
        "/dashboard/:path*",
    ],
};
