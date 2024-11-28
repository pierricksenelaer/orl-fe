import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <>
      {!session ? (
        <div className="container mt-20 ">
          <p className="text-xl font-bold">
            Not signed in. Refresh the page if you are not redirected or already
            signed in.
          </p>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  )
}
