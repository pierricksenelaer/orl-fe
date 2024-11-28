import React, { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Project } from '@/lib/types'

export default function ProjectInviteCard({
  project,
  selectedProjectId,
  setSelectedProjectId,
}: {
  project: Project
  selectedProjectId: String
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>
}) {
  const onClick = () => {
    setSelectedProjectId(project.id)
  }

  const teamMembers = [project.creator, ...project.participants]

  return (
    <div
      className={`w-[200px] flex flex-col hover:shadow-xl ml-1 cursor-pointer rounded-xl border-2 focus:ring-2 py-2 px-2 my-2 break-all ${
        project.id === selectedProjectId && 'ring-2 ring-slate-800'
      }`}
      onClick={onClick}
    >
      <h1 className="text-lg font-bold text-center text-slate-900 ">
        {project.name}
      </h1>
      <h2 className="py-2 text-slate-900 font-semibold">Team members:</h2>
      <div className="flex gap-1">
        {teamMembers.map((member) => {
          return (
            <Avatar className="h-7 w-7 " key={member?.id}>
              <AvatarImage
                src={member?.userPreference.avatar}
                alt={member?.name}
              />
              <AvatarFallback className="text-slate-100 font-bold text-xl bg-slate-800">
                {member?.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )
        })}
      </div>
    </div>
  )
}
