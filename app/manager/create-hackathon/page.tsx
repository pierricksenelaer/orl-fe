import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import CreateHackathonForm from '@/components/create-hackathon-form'
import { Separator } from '@/components/ui/separator'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signIn')
  }

  return (
    <>
      <div className="space-y-6 container mt-16 pb-36">
        <div>
          <h3 className="text-3xl font-bold">Create your hackathon</h3>
          <p className="text-md text-muted-foreground">
            Fill the form to create a new hackathon
          </p>
        </div>
        <Separator />
        <CreateHackathonForm creatorId={session.user.id} />
      </div>
    </>
  )
}
