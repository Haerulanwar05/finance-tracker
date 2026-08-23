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
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch real-time user profile from database
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  const currentUser = {
    ...session.user,
    name: dbUser?.name || session.user.name || "Kawan",
    email: dbUser?.email || session.user.email,
    image: dbUser?.image || session.user.image,
  };

  return (
    <DashboardShell user={currentUser}>
      {children}
    </DashboardShell>
  );
}
