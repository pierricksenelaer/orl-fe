import { getHackathonByHid } from '@/app/libs/hackathons'
import { getProjectsByHackathonId } from '@/app/libs/projects'
import SubmittedProjectInformationCard from '@/components/submitted-project-information-card'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export default async function Page({ params }: { params: { hid: string } }) {
  const projects = await getProjectsByHackathonId(params.hid)
  const hackathon = await getHackathonByHid(params.hid)

  return (
    <div className="container">
      <div className="flex items-center justify-center">
        <div className="space-y-1 mt-6 ">
          <h2 className="text-2xl font-semibold tracking-tight">
            Submissions for{' '}
          </h2>
          <span className="font-extrabold text-3xl font-mono text-orange-100">
            {hackathon?.name}
          </span>
          <p className="text-xl text-muted-foreground text-center">
            {hackathon?.tagline}
          </p>
        </div>
      </div>
      <Separator className="my-4 mb-12" />
      {projects.length !== 0 ? (
        <div className="flex flex-wrap gap-6 justify-start px-2">
          {projects.map((project) => (
            <SubmittedProjectInformationCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <p className="text-2xl font-bold">
            No submissions yet, please come back later.
          </p>
        </div>
      )}
    </div>
  )
}
