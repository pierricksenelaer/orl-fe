'use client'
import { getProjectByPid } from '@/app/libs/projects'
import { Separator } from '@/components/ui/separator'
import { VideoPlayer } from '@/components/videoPlayer'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser'

export default function Page({ params }: { params: { pid: string } }) {
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    const getProjectByPid = async () => {
      try {
        const res = await fetch(`/api/projects/view/${params.pid}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getProjectByPid()
  }, [project, params.pid])

  //todo add team div

  return (
    project && (
      <div className="container">
        <div className="space-y-8  pb-36">
          <div className="flex flex-col text-center space-y-6">
            <h3 className="text-3xl font-bold">{project.name}</h3>
            <p className="text-xl">{project.pitch}</p>
          </div>
          <Separator className="mt-2" />
          {project.videoUrl && (
            <>
              <div className="break-all">
                <h1 className="font-semibold text-2xl font-mono">Video:</h1>
                <VideoPlayer
                  videoUrl={project.videoUrl}
                  width={'640'}
                  height={'380'}
                />
              </div>
              <Separator className="mt-2" />
            </>
          )}
          <div className="break-all">
            <h1 className="font-semibold text-2xl font-mono">Story:</h1>
            <div className="mt-3">{parse(project.story)}</div>
          </div>
          <Separator className="mt-2" />
          <div className="break-all">
            <h1 className="font-semibold text-2xl font-mono">Tech stack:</h1>
            <div className="flex gap-3 mt-2">
              {project.techStack.map((tech: any) => {
                return (
                  <div
                    className="px-2 py-1 bg-sky-600 rounded-lg text-slate-100 font-medium"
                    key={tech.label}
                  >
                    {tech.value}
                  </div>
                )
              })}
            </div>
          </div>
          <Separator className="mt-2" />
          <div className="break-all">
            <h1 className="font-semibold text-2xl font-mono">
              Github repository:
            </h1>
            <div className="flex gap-3 mt-2">
              <a
                href={project.repositoryUrl}
                target="_blank"
                className="hover:underline"
              >
                {project.repositoryUrl}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
