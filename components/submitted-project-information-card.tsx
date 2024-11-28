'use client'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { VideoPlayer } from './videoPlayer'
import { Github } from 'lucide-react'
import { useRouter } from 'next/navigation'
import blueprintImage from '@/components/images/blueprintImage_wvzx3c.jpg'
import Image from 'next/image'

export default function SubmittedProjectInformationCard({ project }: any) {
  const router = useRouter()
  const users = [project.creator]
  project.participants?.forEach((participant: any) => {
    users.push(participant)
  })

  const handleClick = () => {
    router.push(`/dashboard/projects/view/${project.id}`)
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="flex">
        <div className="flex flex-col justify-center gap-2">
          <CardTitle>
            {users.map((user: any) => {
              return (
                <Avatar className="h-12 w-12" key={user.id}>
                  {/* <AvatarImage
                    src={user.userPreference.avatar}
                    alt={user.name}
                  /> */}
                  <AvatarFallback className="text-slate-100 font-bold text-2xl bg-slate-800">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )
            })}
          </CardTitle>
        </div>
        <CardTitle className="flex flex-col justify-center gap-2 text-center">
          {project.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center py-2">
        {project.videoUrl ? (
          <VideoPlayer
            videoUrl={project.videoUrl}
            width={'390'}
            height={'219'}
          />
        ) : (
          <Image
            src={blueprintImage}
            width={200}
            height={200}
            priority={true}
            alt="Thumbnail"
            className="w-[330px] h-[180px] rounded-lg"
          />
        )}
        <VideoPlayer videoUrl={project.videoUrl} width={'390'} height={'219'} />
      </CardContent>
      <CardContent className="flex w-full gap-2 px-3 py-3 justify-center">
        <Github />
        <a href={project.repositoryUrl} target="_blank">
          <span className="break-all">{project.repositoryUrl}</span>
        </a>
      </CardContent>
      <CardFooter className="pt-0 flex flex-col mx-4">
        <Button
          className="w-fit text-xl mt-2 font-bold mx-auto border-2 border-slate-950 bg-slate-100 text-slate-950 hover:text-slate-100 rounded-lg"
          onClick={handleClick}
        >
          View story
        </Button>
      </CardFooter>
    </Card>
  )
}
