import prisma from "@/lib/prisma";
import { z } from "zod";

const updatePositionSchema = z.array(
  z.object({
    id: z.string().max(100),
    position: z.number().max(100),
  })
);

type PositionListRequest = z.infer<typeof updatePositionSchema>;

export async function PUT(request: Request) {
  try {
    const requestBody = await request.json();
    const validateRequest = updatePositionSchema.safeParse(requestBody);
    if (validateRequest.error) {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
    }

    const updaterList = validateRequest.data.map((item: PositionListRequest[0]) => prisma.monthlyDebt.update({ data: { positionIndex: item.position }, where: { id: item.id } }));
    const res = await Promise.all(updaterList);
    return Response.json(res.map(({ id, positionIndex }) => ({ id, positionIndex })));
  } catch {
    return Response.json({ message: "Failed to update item position, please try again later" }, { status: 500 });
  }
}
