import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized" },
      {
        status: 401,
        statusText: "Unauthorized user",
      },
    );
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        receiverEmail: session.user.email,
        isAccepted: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            userPreference: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });

    const notificationsWithHackathons = await Promise.all(
      notifications.map(async (notification) => {
        const project = await prisma.project.findUnique({
          where: {
            id: notification.contentId,
          },
          include: {
            hackathon: {
              select: {
                id: true,
                name: true,
              },
            }, // Include the associated Hackathon within the Project
          },
        });

        return {
          ...notification,
          hackathon: project ? project.hackathon : null,
        };
      }),
    );

    return NextResponse.json(notificationsWithHackathons);
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

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized" },
      {
        status: 401,
        statusText: "Unauthorized user",
      },
    );
  }

  const body = await request.json();

  try {
    const notification = await prisma.notification.findUnique({
      where: {
        id: body.notificationId,
      },
    });

    if (!notification || notification.receiverEmail !== session.user.email) {
      return NextResponse.json(
        { error: "unauthorized action" },
        {
          statusText: "unauthroized action",
          status: 401,
        },
      );
    }

    if (body.action === "ignore") {
      const ignoreNotification = await prisma.notification.update({
        where: {
          id: body.notificationId,
        },
        data: {
          isViewed: true,
        },
      });

      if (ignoreNotification) {
        return NextResponse.json({ message: "ok", status: 200 });
      }

      return NextResponse.json(
        { error: "unexpected error" },
        {
          statusText: "unauthroized action",
          status: 520,
        },
      );
    }

    if (body.action === "accept") {
      const project = await prisma.project.findUnique({
        where: {
          id: notification.contentId,
        },
        include: {
          participants: true,
        },
      });

      if (
        !project ||
        (project.participants && project?.participants.length >= 4)
      ) {
        return NextResponse.json(
          { error: "Project is full" },
          {
            statusText: "Project team is full, contact team leader.",
            status: 406,
          },
        );
      }

      const acceptNotification = await prisma.notification.update({
        where: {
          id: body.notificationId,
        },
        data: {
          isAccepted: true,
          isViewed: true,
        },
      });

      const joinProject = await prisma.project.update({
        where: {
          id: notification.contentId,
        },
        data: {
          participants: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      const joinHackathon = await prisma.hackathon.update({
        where: {
          id: project.hackathonId,
        },
        data: {
          participants: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      if (joinProject && acceptNotification && joinHackathon) {
        return NextResponse.json({ message: "ok", status: 200 });
      }
      return NextResponse.json(
        { error: "unexpected error" },
        {
          statusText: "unauthroized action",
          status: 520,
        },
      );
    }
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
