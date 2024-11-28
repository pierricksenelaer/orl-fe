import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params: { pid } }: { params: { pid: string } }
) {
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
