import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import API from "@/lib/axiosInstance"; // axios ke backend Express

export const authOptions: NextAuthOptions = {
    providers: [
        // OAuth provider Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // Credentials (email/password) → verifikasi ke backend Express
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await API.post("/auth/login", {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    const { user, accessToken } = res.data?.data || {};

                    if (!user) return null;

                    return {
                        ...user,
                        accessToken,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt", // pakai JWT, bukan DB session
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                (token as any).user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = (token as any).user;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
