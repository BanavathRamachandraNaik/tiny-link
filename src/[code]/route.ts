import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const url = await prisma.url.findUnique({ where: { short: code } });
  if (!url) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Increment clicks and update lastClicked
  await prisma.url.update({
    where: { short: code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() },
  });

  return NextResponse.redirect(url.original);
}
