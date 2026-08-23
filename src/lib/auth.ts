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

        let dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email.toLowerCase(),
              name: user.name || "Pengguna",
              image: user.image,
              monthlySpendingLimit: 5000000,
            },
          });

          // Auto-seed initial 3 wallets + standard financial categories
          await prisma.account.createMany({
            data: [
              { userId: dbUser.id, name: "Rekening Utama", type: "BANK", balance: 0, color: "#0052CC" },
              { userId: dbUser.id, name: "Dompet Digital (E-Wallet)", type: "EWALLET", balance: 0, color: "#00875A" },
              { userId: dbUser.id, name: "Uang Tunai (Cash)", type: "CASH", balance: 0, color: "#FFAB00" },
            ],
          });

          await prisma.category.createMany({
            data: [
              { userId: dbUser.id, name: "Makanan & Minuman", type: "EXPENSE", color: "#FF5630", isDefault: true },
              { userId: dbUser.id, name: "Transportasi", type: "EXPENSE", color: "#FFAB00", isDefault: true },
              { userId: dbUser.id, name: "Belanja & Kebutuhan", type: "EXPENSE", color: "#0052CC", isDefault: true },
              { userId: dbUser.id, name: "Tagihan & Utilitas", type: "EXPENSE", color: "#6554C0", isDefault: true },
              { userId: dbUser.id, name: "Hiburan & Rekreasi", type: "EXPENSE", color: "#00B8D9", isDefault: true },
              { userId: dbUser.id, name: "Gaji & Pendapatan", type: "INCOME", color: "#36B37E", isDefault: true },
              { userId: dbUser.id, name: "Investasi & Dividen", type: "INCOME", color: "#00875A", isDefault: true },
            ],
          });
        }

        user.id = dbUser.id;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
