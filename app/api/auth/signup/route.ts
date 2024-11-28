import prisma from '@/lib/prisma'
import { signUpSchema } from '@/lib/types'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

type SignUpFormProps = {
  name: string
  email: string
  password: string
  confirmPassword: string
}
export async function POST(request: Request) {
  const body: SignUpFormProps = await request.json()

  const result = signUpSchema.safeParse(body)

  // check out Zod's .flatten() method for an easier way to process errors
  if (!result.success) {
    let zodErrors = {}
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
    })
    return NextResponse.json({ errors: zodErrors })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })

  if (user) {
    return NextResponse.json({ errors: { email: 'Email already exists' } })
  }
  const hashedPassword = await hash(body.password, 10)

  const created = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      userPreference: {
        create: {},
      },
    },
    include: {
      userPreference: true,
    },
  })

  return NextResponse.json(
    JSON.stringify({ user: { name: created.name, email: created.email } }),
    { status: 201 }
  )
}
