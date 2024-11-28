import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const hackathons = await prisma.hackathon.findMany();

    return NextResponse.json(hackathons);
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

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const hackathon = await prisma.hackathon.findUnique({
      where: {
        id: body.hackathonId,
      },
    });
    return NextResponse.json(hackathon);
  } catch (error) {
    return NextResponse.json({
      error: "Internal server error",
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();

  const updated = await prisma.hackathon.update({
    where: {
      id: body.hackathonId,
    },

    // remove data if not sent
    data: {
      name: body.name,
      description: body.description,
      rules: body.rules,
      tagline: body.tagline,
      managerEmail: body.managerEmail,
      location: body.location,
      timeZone: body.timeZone,
      startDate: body.startDate,
      endDate: body.endDate,
      prizes: body.prizes,
      judges: body.judges,
      requirements: body.requirements,
      about: body.about,
      partners: body.partners,
      resources: body.resources,
      company: body.company,
    },
  });

  return NextResponse.json(updated);
}
