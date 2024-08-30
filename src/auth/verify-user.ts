import prisma from "@/lib/prisma";
import { User } from "next-auth";

export async function verifyUser(user: User) {
  try {
    const dbUser = await prisma.user.findUnique({ where: { email: user?.email as string } });
    if (!dbUser) return { success: true, userId: (await prisma.user.create({ data: { email: user?.email as string, name: user?.name as string } })).id };
    return { success: true, userId: dbUser.id };
  } catch {
    return { success: false, userId: "" };
  }
}
