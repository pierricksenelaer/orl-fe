"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CalendarCheck, Clock, Globe, Map, Medal } from "lucide-react";
import {
  calculateTimeForHackathon,
  calculateTotalPrize,
  convertDateStringToFormattedString,
} from "@/helpers/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Hackathon } from "@/lib/types";

export default function LaunchedHackathonCard({ hackathon }: Hackathon | any) {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const progress = calculateTimeForHackathon(
    hackathon.startDate,
    hackathon.endDate,
    hackathon.timeZone,
    localTimeZone,
  ).progress;
  const router = useRouter();

  return (
    <Card className="bg-black text-white h-[250px] w-[500px]">
      <CardHeader>
        <CardTitle className="min-h-[48px] text-center">
          {hackathon.name}
        </CardTitle>
        <CardDescription className="min-w-[480px] text-center font-light text-neutral-600">
          {hackathon.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent className="-mt-3 grid grid-flow-row-dense grid-cols-2 break-all">
        <div className="flex items-center  rounded-md py-1 transition-all">
          <Clock className="mr-2 h-5 w-5" />
          <p className="text-md text-muted-foreground">
            {`$${calculateTotalPrize(hackathon.prizes)} in prizes`}
          </p>
        </div>
        <div className="flex min-w-[230px]  items-center rounded-md py-1 transition-all">
          <Map className="mr-2 h-5 w-5" />
          <p className="text-md text-muted-foreground">{hackathon.location}</p>
        </div>
        <div className="flex items-center rounded-md py-1 transition-all">
          <Globe className="mr-2 h-5 w-5" />
          <p className="text-md text-muted-foreground">{hackathon.timeZone}</p>
        </div>
        <div className="flex items-center rounded-md py-1 transition-all">
          <CalendarCheck className="mr-2 h-5 w-5" />
          <p className="text-md text-muted-foreground">
            {convertDateStringToFormattedString(
              hackathon.startDate,
              hackathon.endDate,
            )}
          </p>
        </div>
      </CardContent>
      <CardFooter className="-mt-2 flex justify-between">
        <Badge
          className={`ml-10 w-fit px-3 py-1 ${
            progress.isRunning ? "bg-green-600" : "bg-sky-600"
          }`}
        >
          <span className="w-full text-center text-lg">{progress.status}</span>
        </Badge>
        {progress.isRunning && (
          <Button
            className="mr-10 border-2 border-slate-950 bg-slate-100 text-lg font-extrabold text-slate-950 hover:text-slate-100"
            onClick={() => router.push(`/dashboard/hackathons/${hackathon.id}`)}
          >
            Find out & join
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
