import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse(null, { status: 401 })
  }

  try {
    const participants = await prisma.user.findMany({
      where: {
        isAdmin: false,
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        userPreference: {
          select: {
            role: true,
            avatar: true,
            skills: true,
            company: true,
          },
        },
      },
    })
    return NextResponse.json(participants)
  } catch (error) {
    console.error('Error retrieving participants:', error)
    return NextResponse.json(
      {},
      {
        statusText: 'internal server error',
        status: 500,
      }
    )
  }
}
