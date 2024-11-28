import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params: { id, projectId } }: { params: { id: string; projectId: string } }
) {
  try {
    if (!id || !projectId) {
      throw new Error('Missing id or projectId')
    }

    const hackathon = await prisma.project.findUnique({
      where: {
        id: projectId,
        hackathonId: id,
      },
    })

    if (!hackathon) {
      throw new Error('Hackathon not found')
    }

    return NextResponse.json(hackathon)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.error()
  }
}
