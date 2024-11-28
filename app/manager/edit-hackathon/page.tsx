import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getHackathonByHackathonId } from '@/app/libs/hackathons'
import EditHackathonForm from '@/components/edit-hackathon-form'
import { Separator } from '@/components/ui/separator'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string }
}) {
  const session = await getServerSession(authOptions)
  const hackathonId = searchParams?.hid ?? ''

  if (!session || !session.user.isAdmin) {
    redirect('/auth/signIn')
  }

  const hackathon = await getHackathonByHackathonId(hackathonId)

  return (
    <>
      <div className="space-y-6 container mt-16 pb-36">
        <div>
          <h3 className="text-3xl font-bold">Edit your hackathon</h3>
          <p className="text-md text-muted-foreground">
            Configure the hackathon with the details
          </p>
        </div>
        <Separator />
        <EditHackathonForm hackathon={hackathon} />
      </div>
    </>
  )
}
