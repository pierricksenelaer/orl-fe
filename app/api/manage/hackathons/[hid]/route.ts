import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { hid: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    let hackathon = await prisma.hackathon.findUnique({
      where: {
        id: params.hid,
      },
    });

    return NextResponse.json(hackathon);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Session not found") {
        return NextResponse.json({ error: "session not found", status: 401 });
      } else if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "unauthorized", status: 401 });
      } else {
        return NextResponse.json({
          error: "internal server error",
          status: 500,
        });
      }
    }
  }
}
