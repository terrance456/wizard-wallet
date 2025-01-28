import prisma from "@/lib/prisma";
import { auth } from "@/src/auth/auth";
import { User } from "next-auth";
import { z } from "zod";

const createMonthlyDebtSchema = z.object({
  title: z.string().min(1).max(50),
  subTitle: z.string().min(1).max(50),
  content: z.string().min(1).max(100).optional(),
  amount: z.number().max(100_000_0000),
  category: z.string().min(1).max(50).optional(),
  positionIndex: z.number().max(10),
});

export async function POST(request: Request) {
  try {
    const currentUser = (await auth())?.user as User;
    const requestBody = createMonthlyDebtSchema.safeParse(await request.json());

    if (requestBody.error) {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
    }

    await prisma.monthlyDebt.create({ data: { ...requestBody.data, pending: true, userId: currentUser.userId } });
    return Response.json({ message: "Created successfully" }, { status: 201 });
  } catch {
    return Response.json({ message: "Failed to create new debt, please try again" }, { status: 500 });
  }
}
