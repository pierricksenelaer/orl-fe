import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { inviteTeammateSchema } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        statusText: "Unauthorized user",
      },
    );
  }

  const body = await request.json();

  const validationResult = inviteTeammateSchema.safeParse({
    email: body.email,
  });

  if (!validationResult.success) {
    let zodErrors = {};
    validationResult.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    console.log("Validation failed");
    return NextResponse.json(
      { errors: zodErrors },
      {
        status: 401,
        statusText: "Failed to pass email format validation",
      },
    );
  }

  try {
    if (!body.projectId) {
      throw new Error("Missing project id");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        {
          statusText: "User not found",
          status: 401,
        },
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: body.projectId,
      },
      include: {
        creator: true,
        participants: true,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    } else if (project.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "unauthorized" },
        {
          status: 401,
          statusText: "Unauthorized user",
        },
      );
    }

    const teammateEmails = [
      project.creator.email,
      ...project.participants.map((participant) => participant.email),
    ];

    const isEmailAlreadyInProject = teammateEmails.includes(body.email);

    if (isEmailAlreadyInProject) {
      return NextResponse.json(
        { error: "Already in the team" },
        {
          statusText: "This person is already in the team",
          status: 401,
        },
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        receiverEmail: body.email,
        senderId: session.user.id,
        category: "project invitation",
        contentId: project.id,
      },
    });

    console.log("notification", notifications);

    if (notifications.length > 0) {
      return NextResponse.json(
        { error: "Already invited" },
        {
          statusText: "You have invited this email before",
          status: 401,
        },
      );
    }

    const createdNotification = await prisma.notification.create({
      data: {
        category: "project invitation",
        contentId: project.id,
        contentName: project.name,
        receiverEmail: body.email,
        sender: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(createdNotification);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {},
      {
        statusText: "internal server error",
        status: 500,
      },
    );
  }
}
