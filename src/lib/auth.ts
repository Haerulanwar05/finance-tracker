import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/features/auth/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user || !user.passwordHash) return null;

        const passwordMatch = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        try {
          const emailLower = user.email.toLowerCase();
          let dbUser = await prisma.user.findUnique({
            where: { email: emailLower },
          });

          if (!dbUser) {
            dbUser = await prisma.$transaction(async (tx) => {
              const newUser = await tx.user.create({
                data: {
                  email: emailLower,
                  name: user.name || "Pengguna",
                  image: user.image,
                  monthlySpendingLimit: 5000000,
                },
              });

              // Auto-seed initial 3 wallets
              await tx.account.createMany({
                data: [
                  { userId: newUser.id, name: "Rekening Utama", type: "BANK", balance: 0, color: "#0052CC" },
                  { userId: newUser.id, name: "Dompet Digital (E-Wallet)", type: "EWALLET", balance: 0, color: "#00875A" },
                  { userId: newUser.id, name: "Uang Tunai (Cash)", type: "CASH", balance: 0, color: "#FFAB00" },
                ],
              });

              // Auto-seed standard financial categories
              await tx.category.createMany({
                data: [
                  { userId: newUser.id, name: "Makanan & Minuman", type: "EXPENSE", color: "#FF5630", isDefault: true },
                  { userId: newUser.id, name: "Transportasi", type: "EXPENSE", color: "#FFAB00", isDefault: true },
                  { userId: newUser.id, name: "Belanja & Kebutuhan", type: "EXPENSE", color: "#0052CC", isDefault: true },
                  { userId: newUser.id, name: "Tagihan & Utilitas", type: "EXPENSE", color: "#6554C0", isDefault: true },
                  { userId: newUser.id, name: "Hiburan & Rekreasi", type: "EXPENSE", color: "#00B8D9", isDefault: true },
                  { userId: newUser.id, name: "Gaji & Pendapatan", type: "INCOME", color: "#36B37E", isDefault: true },
                  { userId: newUser.id, name: "Investasi & Dividen", type: "INCOME", color: "#00875A", isDefault: true },
                ],
              });

              return newUser;
            });
          }

          user.id = dbUser.id;
          return true;
        } catch (error) {
          console.error("Error provisioning Google OAuth user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (token.email) {
        try {
          const emailLower = token.email.toLowerCase();
          let dbUser = await prisma.user.findUnique({
            where: { email: emailLower },
            select: { id: true, name: true, image: true },
          });

          if (!dbUser && user) {
            // Auto-provision if somehow not created in signIn
            dbUser = await prisma.user.create({
              data: {
                email: emailLower,
                name: user.name || "Pengguna",
                image: user.image,
                monthlySpendingLimit: 5000000,
              },
              select: { id: true, name: true, image: true },
            });
          }

          if (dbUser) {
            token.id = dbUser.id;
            if (dbUser.name) token.name = dbUser.name;
            if (dbUser.image) token.picture = dbUser.image;
          }
        } catch (e) {
          console.error("JWT user lookup error:", e);
        }
      } else if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      } else if (session?.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() },
            select: { id: true, name: true, image: true },
          });
          if (dbUser && session.user) {
            session.user.id = dbUser.id;
            if (dbUser.name) session.user.name = dbUser.name;
            if (dbUser.image) session.user.image = dbUser.image;
          }
        } catch (e) {
          console.error("Session user lookup error:", e);
        }
      }
      return session;
    },
  },
});

