"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTimeForHackathon } from "@/helpers/utils";
import { Hackathon } from "@/lib/types";
import React, { useState } from "react";
import parse from "html-react-parser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface HackathonDetailsProps {
  hackathon: Hackathon;
}

export default function HackathonDetails({ hackathon }: HackathonDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(hackathon.isJoined);
  const [hasProject, setHasProject] = useState(hackathon.hasProject);
  
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const progress = calculateTimeForHackathon(
    hackathon.startDate,
    hackathon.endDate,
    hackathon.timeZone,
    localTimeZone
  ).progress;

  const handleSignIn = () => {
    router.push("/auth/signIn");
  };

  const handleJoin = async () => {
    const res = await fetch("/api/hackathons/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hackathonId: hackathon.id,
        userId: session?.user.id,
      }),
    });

    if (res.ok) {
      setIsJoined(true);
      toast({
        title: "Success!",
        description: "You joined the hackathon.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed 😓",
        description: "We had some issue adding you to the hackathon. Please try again.",
      });
    }
  };

  const handleCreate = () => {
    router.push(`/dashboard/projects/create?hid=${hackathon.id}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/projects/edit?pid=${hackathon.projectId}`);
  };

  return (
    <div className="container">
      <div className="h-full justify-center px-4 py-6 lg:px-8">
        <Tabs defaultValue="overview" className="h-full w-full space-y-6">
          <div className="flex items-center justify-center">
            <TabsList className="flex bg-slate-300 py-6">
              <TabsTrigger
                value="overview"
                className="relative rounded-lg px-6 text-xl data-[state=active]:bg-orange-300 data-[state=active]:font-bold"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                className="rounded-lg px-6 text-xl data-[state=active]:bg-orange-300 data-[state=active]:font-bold"
              >
                Rules
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="rounded-lg px-6 text-xl data-[state=active]:bg-orange-300 data-[state=active]:font-bold"
              >
                Resources
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="overview"
            className="flex w-full flex-col justify-center border-none p-0 outline-none"
          >
            <div className="mt-6 flex items-center justify-center">
              <div className="space-y-1">
                <h2 className="text-3xl font-semibold tracking-tight">
                  {hackathon.name}
                </h2>
                <p className="text-muted-foreground text-center text-xl text-slate-400">
                  {hackathon.tagline}
                </p>
              </div>
            </div>
            <div className="mx-auto mt-6 flex w-full items-center justify-center gap-4 text-lg">
              <div className="grid grid-cols-2">
                <div className="mr-4 font-semibold">Start Date:</div>
                {hackathon.startDate}
                <div className="mr-4 font-semibold">End Date:</div>
                {hackathon.endDate}
              </div>
              <Badge
                className={`w-fit py-2 ${
                  progress.isRunning ? "bg-green-600" : "bg-sky-600"
                }`}
              >
                <span className="w-full text-center text-lg">
                  {progress.status}
                </span>
              </Badge>
            </div>

            <div className="mt-6 flex w-full justify-center">
              {progress.isRunning &&
                (!session ? (
                  <Button
                    className="w-fit bg-sky-600 py-8 text-xl hover:bg-sky-800"
                    onClick={handleSignIn}
                  >
                    Sign in to join
                  </Button>
                ) : isJoined ? (
                  hasProject ? (
                    <Button
                      className="w-fit bg-teal-600 py-6 text-xl font-bold hover:ring-2 hover:ring-slate-200"
                      onClick={handleEdit}
                    >
                      Edit your project
                    </Button>
                  ) : (
                    <Button
                      className="w-fit bg-green-800 py-6 text-xl font-bold hover:ring-2 hover:ring-slate-200"
                      onClick={handleCreate}
                    >
                      Create your project
                    </Button>
                  )
                ) : (
                  <Button
                    className="w-fit bg-orange-500 py-6 text-xl font-bold hover:ring-2 hover:ring-slate-200"
                    onClick={handleJoin}
                  >
                    Click to join
                  </Button>
                ))}
            </div>

            <div className="mx-10 mt-5 flex flex-col py-6 text-xl lg:mx-20">
              {parse(hackathon.description)}
            </div>

            <div className="mx-10 flex flex-col py-6 text-xl lg:mx-20">
              <h1 className="font-bold uppercase tracking-wide">Location</h1>
              <hr className="mt-2" />
              <h6 className="mt-3">{hackathon.location}</h6>
            </div>

            <div className="mx-10 flex flex-col py-6 text-xl lg:mx-20">
              <h1 className="font-bold uppercase tracking-wide">Requirements</h1>
              <hr className="mt-2" />
              <div className="mt-3">{parse(hackathon.requirements)}</div>
            </div>

            <div className="mx-10 flex flex-col py-6 text-xl lg:mx-20">
              <h1 className="font-bold uppercase tracking-wide">Prizes</h1>
              <hr className="mt-2" />
              <div className="mt-3 flex w-full gap-6">
                {Array.isArray(hackathon.prizes) &&
                  hackathon.prizes.map((prize, index) => (
                    <div className="mx-auto w-full" key={index}>
                      <div>🏆 {prize.name}</div>
                      <div>🪙 ${prize.value}</div>
                      <div>{prize.numberOfWinningTeams} winning teams</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mx-10 flex flex-col py-6 text-xl lg:mx-20">
              <h1 className="font-bold uppercase tracking-wide">Judges</h1>
              <hr className="mt-2" />
              <div className="mt-3">{parse(hackathon.judges)}</div>
            </div>
          </TabsContent>
          <TabsContent
            value="rules"
            className="flex w-full flex-col justify-center border-none p-0 outline-none"
          >
            <div className="mt-3 text-lg">{parse(hackathon.rules)}</div>
          </TabsContent>
          <TabsContent
            value="resources"
            className="flex w-full flex-col justify-center border-none p-0 outline-none"
          >
            <div className="mt-3 text-lg">{parse(hackathon.resources)}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}