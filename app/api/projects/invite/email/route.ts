import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/app/libs/sendinblue";
import { inviteTeammateSchema } from "@/lib/types";
import prisma from "@/lib/prisma";

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

  if (!body.projectId || !body.email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      {
        status: 400,
        statusText: "Missing required fields",
      },
    );
  }

  const validationResult = inviteTeammateSchema.safeParse({
    email: body.email,
  });

  if (!validationResult.success) {
    let zodErrors = {};
    validationResult.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    console.log("validation failed");
    return NextResponse.json(
      { errors: zodErrors },
      {
        status: 401,
        statusText: "Failed to validate the email format",
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
        hackathon: true,
      },
    });

    if (!project) {
      throw new Error("Project is not found");
    } else if (project.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "unauthorized" },
        {
          status: 401,
          statusText: "User is not authorized",
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
        { error: "Already in this team" },
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

    if (notifications.length > 0) {
      return NextResponse.json(
        { error: "Already invited" },
        {
          statusText: "You have invited this email before",
          status: 401,
        },
      );
    }
    await sendEmail(
      project.name,
      project.hackathon.name,
      project.hackathon.id,
      session.user.name,
      body.email,
    );

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

  return NextResponse.json({});
}
