import { getLaunchedHackathons } from '@/app/libs/hackathons'
import HackathonCardForSubmittedProjects from '@/components/hackathon-card-for-submitted-projects'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export default async function Page() {
  const hackathons = await getLaunchedHackathons()

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="space-y-1 mt-6 ">
            <h2 className="text-2xl font-semibold tracking-tight">Join Now</h2>
            <p className="text-lg text-muted-foreground">
              Explore different hackathons. Join for free.
            </p>
          </div>
        </div>
        <Separator className="my-4 mb-12" />
        <div className="grid 2xl:grid-cols-2 gap-6 justify-items-center">
          {hackathons &&
            hackathons.map((hackathon) => (
              <HackathonCardForSubmittedProjects
                key={hackathon.id}
                hackathon={hackathon}
              />
            ))}
        </div>
      </div>
    </>
  )
}
