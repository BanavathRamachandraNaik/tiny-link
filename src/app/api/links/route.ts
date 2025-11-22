import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { original, short } = await req.json();

    if (!original || !short) {
      return NextResponse.json(
        { error: "Original URL and short code are required" },
        { status: 400 }
      );
    }

    // Check if short code already exists
    const existing = await prisma.url.findUnique({ where: { short } });
    if (existing) {
      return NextResponse.json(
        { error: "Short code already exists" },
        { status: 409 }
      );
    }

    // Create new URL
    const url = await prisma.url.create({
      data: { original, short },
    });

    return NextResponse.json(url, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while creating short URL" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const urls = await prisma.url.findMany();
    return NextResponse.json(urls);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while fetching URLs" },
      { status: 500 }
    );
  }
}
