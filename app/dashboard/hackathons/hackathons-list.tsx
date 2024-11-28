'use client'
import { Separator } from '@/components/ui/separator'
import LaunchedHackathonCard from '@/components/launched-hackathon-card'
import React, { useEffect, useState } from 'react'
import { Session } from 'next-auth'

interface HackathonsListProps {
  initialHackathons: any[] // Replace 'any' with your actual hackathon type
  session: Session | null
}

export default function HackathonsList({ 
  initialHackathons, 
  session 
}: HackathonsListProps) {
  const [hackathons, setHackathons] = useState(initialHackathons)

  useEffect(() => {
    // Log detailed session information
    console.log('Session Status:', session ? 'Authenticated' : 'Not Authenticated')
    
    if (session) {
      console.log('User Details:', {
        name: session.user?.name || 'No name provided',
        email: session.user?.email || 'No email provided',
        isAdmin: session.user?.isAdmin ? 'Admin User' : 'Regular User',
      })

      // Specific role checks
      if (session.user?.isAdmin) {
        console.log('🔐 User has admin privileges')
      } else {
        console.log('👤 User is logged in but is not an admin')
      }
    } else {
      console.log('❌ No user session found - user is not logged in')
    }
  }, [session])

  // If you want to fetch hackathons from API, uncomment this useEffect
  /*
  useEffect(() => {
    const getLaunchedHackathon = async () => {
      try {
        const res = await fetch('/api/hackathons')
        console.log('herebeforeResponse')
        if (res.ok) {
          const data = await res.json()
          setHackathons(data)
          console.log('here2')
        }
      } catch (error) {
        console.log('here' + error)
      }
    }
    getLaunchedHackathon()
  }, [])
  */

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="space-y-1 mt-6">
            <h2 className="text-2xl font-semibold tracking-tight">Join Now</h2>
            <p className="text-lg text-muted-foreground">
              Explore different group discussions. Join for free.
            </p>
          </div>
        </div>
        <Separator className="my-4 mb-12" />
        <div className="grid 2xl:grid-cols-2 gap-6 justify-items-center">
          {hackathons &&
            hackathons.map((hackathon: any) => (
              <LaunchedHackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
        </div>
      </div>
    </>
  )
}