import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.monthlyDebt.updateMany({ data: { pending: true } });
    return Response.json({ message: "Patched" }, { status: 200 });
  } catch {
    return Response.json({ message: "failed" }, { status: 500 });
  }
}
