import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
export async function GET(request: Request) {
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
    const projects = await prisma.project.findMany({
      where: {
        creatorId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        pitch: true,
        isSubmitted: true,
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
            userPreference: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            userPreference: true,
          },
        },
      },
    })

    return NextResponse.json(projects)
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
