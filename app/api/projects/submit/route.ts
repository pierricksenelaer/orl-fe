import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: 'unauthorized' },
      {
        status: 401,
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
        id: body.userId,
      },
    })

    if (!user) {
      return NextResponse.json(
        {},
        {
          statusText: 'User not found',
          status: 401,
        }
      )
    } else if (session.user.email !== user.email) {
      return NextResponse.json(
        {},
        {
          statusText: 'unauthorized',
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
      throw new Error('You are not allowed to submit this project')
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: body.projectId,
      },
      data: {
        isSubmitted: true,
      },
    })

    return NextResponse.json(updatedProject)
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
