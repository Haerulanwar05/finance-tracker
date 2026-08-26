import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Route Protection: Redirect unauthenticated users to /login
  if (!session?.user?.id && !session?.user?.email) {
    redirect("/login");
  }

  let userId = session?.user?.id;
  let dbUser = null;

  try {
    if (userId) {
      dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
    }

    if (!dbUser && session?.user?.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: session.user.email.toLowerCase() },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
    }
  } catch (error) {
    console.error("DashboardLayout: safe fallback on user query error:", error);
  }

  const currentUser = {
    ...session?.user,
    id: dbUser?.id || session?.user?.id || "anonymous",
    name: dbUser?.name || session?.user?.name || "Kawan",
    email: dbUser?.email || session?.user?.email,
    image: dbUser?.image || session?.user?.image,
  };

  return (
    <DashboardShell user={currentUser}>
      {children}
    </DashboardShell>
  );
}
