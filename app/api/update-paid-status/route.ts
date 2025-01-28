import prisma from "@/lib/prisma";
import { auth } from "@/src/auth/auth";
import { User } from "next-auth";
import { z } from "zod";

const updatePaidStatusSchema = z.object({
  id: z.string().max(100),
  pending: z.boolean(),
});

export async function PATCH(request: Request) {
  try {
    const currentUser = (await auth())?.user as User;
    const requestBody = await request.json();
    const validateRequest = updatePaidStatusSchema.safeParse(requestBody);
    if (validateRequest.error) {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
    }
    await prisma.monthlyDebt.update({ data: { pending: validateRequest.data.pending }, where: { id: validateRequest.data.id, userId: currentUser.id } });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ message: "Failed to update status, please try again later" }, { status: 500 });
  }
}
