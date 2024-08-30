import prisma from "@/lib/prisma";
import { auth } from "@/src/auth/auth";
import { User } from "next-auth";

export async function GET() {
  try {
    const currentUser = (await auth())?.user as User;
    return Response.json(await prisma.monthlyDebt.findMany({ where: { userId: currentUser.userId } }));
  } catch {
    return Response.json({ message: "Failed to retrive list, please try again" }, { status: 500 });
  }
}
