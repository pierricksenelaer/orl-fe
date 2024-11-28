import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: 'unauthorized' },
      {
        status: 401,
        statusText: 'Unauthorized user',
      }
    )
  }

  const body = await request.json()

  try {
    if (!body.projectId) {
      throw new Error('Missing project id')
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        {
          statusText: 'User not found',
          status: 401,
        }
      )
    }

    const project = await prisma.project.findUnique({
      where: {
        id: body.projectId,
      },
    })

    if (!project) {
      throw new Error('Project not found')
    } else if (project.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: 'unauthorized' },
        {
          status: 401,
          statusText: 'Unauthorized user',
        }
      )
    }

    const participant = await prisma.user.findUnique({
      where: {
        id: body.participantId,
      },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        {
          statusText: 'Participant not found',
          status: 401,
        }
      )
    }

    const notifications = await prisma.notification.findMany({
      where: {
        receiverEmail: participant.email,
        senderId: session.user.id,
        category: 'project invitation',
        contentId: project.id,
      },
    })

    console.log('notification', notifications)

    if (notifications.length > 0) {
      return NextResponse.json(
        { error: 'Already invited' },
        {
          statusText: 'You have invited this email before',
          status: 401,
        }
      )
    }

    const createdNotification = await prisma.notification.create({
      data: {
        category: 'project invitation',
        contentId: project.id,
        contentName: project.name,
        receiverEmail: participant.email,
        sender: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json(createdNotification)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {},
      {
        statusText: 'internal server error',
        status: 500,
      }
    )
  }
}
