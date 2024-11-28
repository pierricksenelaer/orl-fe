import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
export async function POST(request: Request) {
  const body = await request.json()

  try {
    const hackathon = await prisma.hackathon.create({
      data: {
        name: body.name,
        tagline: body.tagline || '',
        managerEmail: body.email || '',
        location: body.location || '',
        timeZone: body.timeZone || '',
        startDate: body.startDate || '',
        endDate: body.endDate || '',
        description: body.descriptionContent || '',
        requirements: body.requirementContent || '',
        rules: body.rulesContent || '',
        resources: body.resourcesContent || '',
        judges: body.judgesContent || '',
        partners: body.partnersContent || '',
        prizes: body.prizes,
        creatorId: body.creatorId,
      },
    })

    return NextResponse.json({ message: 'ok', status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'internal server error',
      status: 500,
    })
  }
}
