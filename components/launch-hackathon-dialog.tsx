'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { useToast } from './ui/use-toast'
import { Icons } from './ui/ui-icons'

type ValidationData = {
  name: string | null
  tagline: string | null
  managerEmail: string | null
  timeZone: string | null
  location: string | null
  startDate: string | null
  endDate: string | null
  requirements: string | null
  rules: string | null
  description: string | null
  judges: string | null
}

export default function LaunchHackathonDialog({
  open,
  onOpenChange,
  setOpenLaunchDialog,
  hackathonId,
  setIsLaunched,
}: any) {
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const validateProjectData = (validationData: ValidationData) => {
    let errorMessage = ''
    const errorNames = {
      name: 'Name',
      tagline: 'Tagline',
      managerEmail: 'Email',
      timeZone: 'Time-zone',
      location: 'Location',
      startDate: 'Start Date',
      endDate: 'End Date',
      requirements: 'Requirements',
      rules: 'Rules',
      description: 'Description',
      judges: 'Judges',
    }

    const validateProperty = (
      propertyName: keyof ValidationData,
      propertyValue: any
    ) => {
      if (propertyValue === null || propertyValue === undefined) {
        errorMessage = errorMessage
          ? errorMessage + ',  ' + errorNames[propertyName]
          : errorNames[propertyName]
      } else if (
        (typeof propertyValue === 'string' &&
          (propertyValue.trim() === '' ||
            propertyValue.trim() === '<p></p>')) ||
        (Array.isArray(propertyValue) && propertyValue.length === 0)
      ) {
        errorMessage = errorMessage
          ? errorMessage + ',  ' + errorNames[propertyName]
          : errorNames[propertyName]
      }
    }

    Object.keys(validationData).forEach((propertyName) => {
      validateProperty(
        propertyName as keyof ValidationData,
        validationData[propertyName as keyof ValidationData]
      )
    })

    if (errorMessage !== '') {
      setErrorMessage(errorMessage)
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch(`/api/manage/hackathons/${hackathonId}`)
      if (res.ok) {
        const data = await res.json()

        const validationData = {
          name: data.name,
          tagline: data.tagline,
          managerEmail: data.managerEmail,
          location: data.location,
          description: data.description,
          requirements: data.requirements,
          rules: data.rules,
          judges: data.judges,
          startDate: data.startDate,
          endDate: data.endDate,
          timeZone: data.timeZone,
        }
        const isValid = validateProjectData(validationData)
        if (!isValid) {
          setIsSubmitting(false)
          return
        } else {
          await launchHackathon()
          setIsSubmitting(false)
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to submit project',
          description:
            'Failed to retrieve project data, please try again later.',
        })
        setOpenLaunchDialog(false)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const launchHackathon = async () => {
    try {
      const res = await fetch('/api/manage/hackathons/launch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hackathonId,
        }),
      })
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Your hackathon is launched.',
        })
        setIsLaunched(true)
        setOpenLaunchDialog(false)
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to launch hackathon',
          description: 'Failed to launch hackathon, please try again later.',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!open) {
      setErrorMessage('')
    }
  }, [setErrorMessage, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-100 min-w-[550px]	">
        <DialogHeader className="text-slate-900">
          {errorMessage === '' ? (
            <DialogTitle className="text-2xl font-bold text-slate-800 text-center">
              Lauching your hackathon
            </DialogTitle>
          ) : (
            <DialogTitle className="text-2xl font-bold text-red-500 text-center">
              Submission error
            </DialogTitle>
          )}
        </DialogHeader>

        {errorMessage === '' ? (
          <div className="mb-2">
            <p className="text-lg text-slate-800 font-medium mt-2 text-center">
              Your hackathon will be publicly visible once launched.
            </p>
            <p className="text-lg text-slate-800 font-medium mt-2 text-center">
              You can still edit after hackathon is lauched.
            </p>
            <h1 className="text-mdl text-slate-900 text-center mt-4">
              Click confirm to launch
            </h1>
          </div>
        ) : (
          <div className="flex flex-col justify-center text-center">
            <h1 className="text-xl text-slate-900">
              Following fields are required to be filled before launching:
            </h1>
            <p className="text-red-500 text-xl font-bold">{errorMessage}</p>
            <p className="text-amber-700 text-md font-mono mt-5">
              Make sure you update your changes before launching
            </p>
          </div>
        )}
        <DialogFooter className="flex gap-4">
          <DialogClose asChild>
            <Button className="mr-1" variant={'destructive'}>
              <span>Cancel</span>
            </Button>
          </DialogClose>
          <Button
            className="bg-green-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
