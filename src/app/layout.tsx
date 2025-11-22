import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavbarComponent from "@/components/Navbar";
// import FooterComponent from "@/components/FooterComponent";
import ThemeInit from "@/components/ThemeInit";
import { AuthProvider } from "@/contexts/AuthContext";

// Optional Google Font (lebih clean & modern)
import { Inter } from "next/font/google";
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
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} antialiased bg-white text-gray-900`}
            >
                <AuthProvider>
                    <ThemeInit />
                    <NavbarComponent />
                    <main className="min-h-screen">{children}</main>
                    {/* <FooterComponent /> */}
                    <Toaster position="top-right" richColors />
                </AuthProvider>
            </body>
        </html>
    );
}
