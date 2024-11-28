import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { checkIsEndDatePassed } from '@/helpers/utils'
export async function GET(
  request: Request,
  { params: { pid } }: { params: { pid: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  try {
    if (!pid) {
      throw new Error('Missing project id')
    }

    const project = await prisma.project.findUnique({
      where: {
        id: pid,
      },
      include: {
        hackathon: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            timeZone: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            userPreference: true,
          },
        },
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return NextResponse.json(project)
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

export async function PUT(
  request: Request,
  { params: { pid } }: { params: { pid: string } }
) {
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
    if (!pid) {
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
        { error: 'You are not allowed to update this project' },
        {
          statusText: 'unauthorized',
          status: 401,
        }
      )
    }

    const project = await prisma.project.findUnique({
      where: {
        id: pid,
      },
      include: {
        hackathon: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            timeZone: true,
          },
        },
      },
    })

    if (project?.hackathon.endDate && project?.hackathon.timeZone) {
      const isEndDatePassed: boolean = checkIsEndDatePassed(
        project.hackathon.endDate,
        project.hackathon.timeZone
      )
      if (isEndDatePassed) {
        return NextResponse.json(
          { error: 'Hackathon has ended' },
          {
            status: 401,
          }
        )
      }
    }

    if (!project) {
      throw new Error('Project not found')
    } else if (project.creatorId !== session.user.id) {
      throw new Error('You are not allowed to view this project')
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: pid,
      },
      data: {
        name: body.name,
        pitch: body.pitch,
        techStack: body.techStack,
        repositoryUrl: body.repositoryUrl,
        videoUrl: body.videoUrl,
        story: body.story,
      },
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'internal server error' },
      {
        statusText: 'internal server error',
        status: 500,
      }
    )
  }
}
