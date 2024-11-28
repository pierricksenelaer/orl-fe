import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "./auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  console.log("GET API", session);
  return NextResponse.json({ authenticated: !!session });
}

//todo: add api route protection for projects and submissions using nextAuth
