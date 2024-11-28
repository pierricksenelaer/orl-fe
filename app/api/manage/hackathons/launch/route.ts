import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  const body = await request.json()

  const updated = await prisma.hackathon.update({
    where: {
      id: body.hackathonId,
    },
    // remove data if not sent
    data: {
      launched: true,
    },
  })

  return NextResponse.json(updated)
  // return NextResponse.json({ message: 'ok' })
}
