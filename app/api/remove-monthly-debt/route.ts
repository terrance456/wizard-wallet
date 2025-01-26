import prisma from "@/lib/prisma";
import { auth } from "@/src/auth/auth";
import { User } from "next-auth";
import { z } from "zod";

const deleteMonthlyDebtSchema = z.object({
  id: z.string().min(1).max(100),
});

export async function DELETE(request: Request) {
  try {
    const currentUser = (await auth())?.user as User;
    const requestBody = deleteMonthlyDebtSchema.safeParse(await request.json());

    if (requestBody.error) {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
    }

    await prisma.monthlyDebt.delete({ where: { userId: currentUser.id, id: requestBody.data.id } });
    return Response.json({ message: "Deleted successfully" }, { status: 202 });
  } catch {
    return Response.json({ message: "Failed to delete debt, please try again" }, { status: 500 });
  }
}
