"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Project,
  TInviteTeammateSchema,
  inviteTeammateSchema,
} from "@/lib/types";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "./ui/ui-icons";
import { calculateTimeForHackathon } from "@/helpers/utils";
import { useToast } from "./ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const TEAMSIZE = 12;
const getTitleAndDescription = (project: Project, userId: string) => {
  let title = "";
  let description = "";
  if (project.participants.length === 0) {
    title = "You are soloing";
    description = "Invite people to join. Team size limit: 5";
  } else {
    if (project.creatorId === userId) {
      title = "You are project lead";
      if (project.participants.length < TEAMSIZE - 1) {
        description = "Invite people to join. Team size limit: 5";
      } else {
        description = "Your team is full.";
      }
    } else {
      title = "You are part of the team";
      description = "Ask project lead to edit";
    }
  }

  return {
    title,
    description,
  };
};

export default function ProjectTeamCard({
  userId,
  project,
}: {
  userId: string;
  project: Project | any;
}) {
  const { toast } = useToast();
  const header = getTitleAndDescription(project, userId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TInviteTeammateSchema>({
    resolver: zodResolver(inviteTeammateSchema),
  });
  const [openSendEmailDialog, setOpenSendEmailDialog] = useState(false);
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const progress = calculateTimeForHackathon(
    project.hackathon.startDate,
    project.hackathon.endDate,
    project.hackathon.timeZone,
    localTimeZone,
  ).progress;

  const teamMembers = useMemo(() => {
    const arr = [project.creator, ...project.participants];
    const filteredArr = arr.filter((member) => member.id !== userId);
    return filteredArr;
  }, [project.creator, project.participants, userId]);
  const onSubmit = async (data: TInviteTeammateSchema) => {
    try {
      // const res = await fetch("/api/projects/invite/email");
      const res = await fetch("/api/projects/invite/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          email: data.email,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast({
          title: "Success!",
          description: "You have sent the invitation.",
        });
        reset();
        setOpenSendEmailDialog(false);
      } else {
        toast({
          variant: "destructive",
          title: "Failed 😓",
          description: res.statusText,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed 😓",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (!openSendEmailDialog) reset();
  }, [openSendEmailDialog, reset]);

  return (
    <Card className="ml-2 w-[360px] border-none bg-slate-900">
      <CardHeader className="grid grid-rows-2 pb-3 text-center">
        <CardTitle className="text-slate-100">{header.title}</CardTitle>
        <CardDescription className="text-md text-slate-100">
          {header.description}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col w-full gap-3 mt-3">
        {teamMembers.map((member) => {
          return (
            <div
              className="flex items-center text-xl font-bold text-slate-100"
              key={member.id}
            >
              <Avatar className="mr-3 h-11 w-11">
                <AvatarImage
                  src={member.userPreference.avatar}
                  alt={member.name}
                />
                <AvatarFallback className="text-2xl font-bold bg-slate-800 text-slate-100">
                  {member.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {member.name}
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex justify-center w-full">
        {project.participants.length < TEAMSIZE - 1 &&
          project.creatorId === userId &&
          progress.isRunning && (
            <Dialog
              open={openSendEmailDialog}
              onOpenChange={setOpenSendEmailDialog}
            >
              <DialogTrigger asChild>
                <Button className="font-mono text-xl font-bold border-2 border-slate-900 bg-slate-200 text-slate-900 hover:text-slate-200">
                  Invite teammate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-slate-900">
                  <DialogTitle className="text-xl font-bold">
                    Invite a teammate by email
                  </DialogTitle>
                  <DialogDescription>
                    Type the email of the person you want to invite
                  </DialogDescription>
                </DialogHeader>
                <form className="text-slate-900">
                  <Input
                    {...register("email")}
                    id="name"
                    placeholder="Email"
                    className="col-span-3"
                  />
                  {errors.email && (
                    <p className="text-red-500">{`${errors.email.message}`}</p>
                  )}
                </form>
                <DialogFooter>
                  <Button
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    className="bg-green-700"
                  >
                    {isSubmitting && (
                      <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Send email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            //todo add dialog close interaction on send email button when email is sent.  Add interaction on dialog for when email is failed to send. Show error message.
          )}
      </CardFooter>
    </Card>
  );
}
