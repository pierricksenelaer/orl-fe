'use client'
import ParticipantInformationCard from '@/components/participant-information-card'
import ProjectInviteCard from '@/components/project-invite-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { SelectSeparator } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/ui/ui-icons'
import { useToast } from '@/components/ui/use-toast'
import { Participant, Project } from '@/lib/types'
import { GraduationCap, Wrench } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

export default function Page() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedRoles, setSelectedRoles] = useState<String[]>([])
  const [selectedSkills, setSelectedSkills] = useState<String[]>([])
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [openInviteDialog, setOpenInviteDialog] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [dialogError, setDialogError] = useState<string>('')
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const { toast } = useToast()

  const getParticipants = useCallback(async () => {
    try {
      const res = await fetch('/api/users/participants')
      if (res.ok) {
        const data = await res.json()
        setParticipants(data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [setParticipants])

  const getProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/users/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [setProjects])

  useEffect(() => {
    getProjects()
  }, [getProjects])

  useEffect(() => {
    getParticipants()
  }, [getParticipants])

  const handleRoleChange = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }
  const handleSkillChange = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  useEffect(() => {
    const filteredParticipantsWithRoles = participants.filter((participant) => {
      if (selectedRoles.length === 0) {
        return true // Show all users if no roles are selected
      }
      return selectedRoles.includes(participant?.userPreference?.role.label)
    })
    const filteredParticipantsWithRolesAndSkills =
      filteredParticipantsWithRoles.filter((participant) => {
        if (selectedSkills.length === 0) {
          return true // Show all users if no skills are selected
        }
        const userSkills = participant?.userPreference?.skills.map(
          (skill: any) => skill.label
        )
        return selectedSkills.some((item) => userSkills.includes(item))
      })
    setFilteredParticipants(filteredParticipantsWithRolesAndSkills)
  }, [
    participants,
    setParticipants,
    selectedRoles,
    setSelectedRoles,
    setSelectedSkills,
    selectedSkills,
  ])

  useEffect(() => {
    if (!openInviteDialog) {
      setSelectedProjectId('')
      setDialogError('')
      setSelectedUserId('')
    }
  }, [openInviteDialog])

  const handleInvite = async () => {
    if (!selectedProjectId) {
      setDialogError('Please select a project')
      return
    }
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/projects/invite/internal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          participantId: selectedUserId,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        toast({
          title: 'Success!',
          description: 'Sent the invitation.',
        })
        setOpenInviteDialog(false)
        setIsSubmitting(false)
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed 😓',
          description: res.statusText,
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Failed 😓',
        description: 'Something went wrong. Please try again.',
      })
      setIsSubmitting(false)
    }
  }

  const roles = [
    'Full-stack developer',
    'Front-end developer',
    'Back-end developer',
    'UI Designer',
    'Data Scientist',
    'Product Manager',
    'Business Manager',
  ]

  const skills = [
    'JavaScript',
    'C#',
    'Ruby',
    'React',
    'Python',
    'Java',
    'Vue.js',
  ]

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="space-y-1 mt-6 ">
            <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
            <p className="text-lg text-muted-foreground">
              Invite users to join your hackathon project.
            </p>
          </div>
        </div>
        <Separator className="my-4 mb-12" />

        <div className="flex w-full">
          <div className="flex-col mr-10">
            <h1 className="mb-3 font-bold ">FILTERS: </h1>
            <SelectSeparator />
            <div>
              <div className="flex items-center -ml-1">
                <GraduationCap className="h-6 w-6 text-slate-300 mr-1" />
                <h1 className="text-slate-300 font-bold text-lg">Roles</h1>
              </div>
              <div className="flex flex-col mt-2">
                {roles.map((role) => (
                  <div
                    className="flex items-center space-x-2 w-[12rem] mb-2"
                    key={role}
                  >
                    <Checkbox
                      id="ripple-on"
                      value={role}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={() => handleRoleChange(role)}
                      className="bg-slate-300 rounded-sm"
                    />
                    <label
                      htmlFor="terms"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <SelectSeparator />

            <div className="mt-2">
              <div className="flex items-center -ml-1">
                <Wrench className="h-6 w-6 text-slate-300 mr-1" />
                <h1 className="text-slate-300 font-bold text-lg">Skills</h1>
              </div>
              <div className="flex flex-col mt-2">
                {skills.map((skill) => (
                  <div
                    className="flex items-center space-x-2 w-[12rem] mb-2"
                    key={skill}
                  >
                    <Checkbox
                      id="ripple-on"
                      value={skill}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => handleSkillChange(skill)}
                      className="bg-slate-300 rounded-sm"
                    />
                    <label
                      htmlFor="terms"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-start h-full">
            {filteredParticipants && filteredParticipants.length !== 0 ? (
              filteredParticipants.map((participant) => (
                <ParticipantInformationCard
                  key={participant.id}
                  participant={participant}
                  setOpenInviteDialog={setOpenInviteDialog}
                  setSelectedUserId={setSelectedUserId}
                />
              ))
            ) : (
              <div className="text-xl font-bold ">
                No participants yet. Please check later.
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={openInviteDialog} onOpenChange={setOpenInviteDialog}>
        <DialogContent className="w-[800px]">
          <DialogHeader className="text-slate-900">
            <DialogTitle className="text-xl font-bold">
              Invite a teammate
            </DialogTitle>
            <DialogDescription>Select a project to invite</DialogDescription>
          </DialogHeader>
          <ScrollArea className="border h-full w-full px-2 py-2 rounded-md">
            <div className="text-slate-900 flex gap-3">
              {projects.length !== 0 ? (
                projects.map((project) => (
                  <ProjectInviteCard
                    key={project.id}
                    project={project}
                    selectedProjectId={selectedProjectId}
                    setSelectedProjectId={setSelectedProjectId}
                  />
                ))
              ) : (
                <div>
                  You don&apos;t have unsubmitted projects or your project team
                  is full.
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div>
            {dialogError && (
              <div className="text-red-600 font-bold text-center">
                {dialogError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={handleInvite}
              className="bg-green-700"
            >
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
