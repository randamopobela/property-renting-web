import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavbarComponent from "@/components/Navbar";
// import FooterComponent from "@/components/FooterComponent";
import ThemeInit from "@/components/ThemeInit";
import { SessionProvider } from "next-auth/react";
import Script from "next/script"; // 👈 1. Import Script

// Optional Google Font (lebih clean & modern)
import { Inter } from "next/font/google";
import { Providers } from "./provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "StayEase - Platform Penyewaan Properti",
    description:
        "Platform untuk penyewaan dan memesan penginapan terbaik di Indonesia.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 2. Ambil Client Key dari .env.local
    const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} antialiased bg-white text-gray-900`}
            >
                <Providers>
                    <ThemeInit />
                    <NavbarComponent />
                    <main className="min-h-screen">{children}</main>
                    {/* <FooterComponent /> */}
                    <Toaster position="top-right" richColors />
                </Providers>

                {/* 3. Tambahkan Script Midtrans di sini */}
                <Script 
                    src="https://app.sandbox.midtrans.com/snap/snap.js"
                    data-client-key={midtransClientKey}
                    strategy="lazyOnload" 
                />
            </body>
        </html>
    );
}
