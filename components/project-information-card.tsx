"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Image, { StaticImageData } from "next/image";
import blueprintImage from "@/components/images/BlueprintImage.png";
import {
  Youtube,
  calculateTimeForHackathon,
  getVimeoThumbnailUrl,
} from "@/helpers/utils";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";

type ProjectInformationCardProps = {
  project: Project;
  userId: string;
};

export default function ProjectInformationCard({
  project,
  userId,
}: ProjectInformationCardProps) {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const progress = calculateTimeForHackathon(
    project.hackathon.startDate,
    project.hackathon.endDate,
    project.hackathon.timeZone,
    localTimeZone,
  ).progress;

  const [imgUrl, setImgUrl] = useState<string | StaticImageData>("");
  const router = useRouter();

  useEffect(() => {
    const getImgUrl = async () => {
      if (project?.videoUrl.includes("youtube.com")) {
        const imageUrl = Youtube.thumb(project.videoUrl, "small");
        setImgUrl(imageUrl);
      } else if (project?.videoUrl.includes("vimeo.com")) {
        const imageUrl = await getVimeoThumbnailUrl(project.videoUrl);
        setImgUrl(imageUrl);
      } else {
        setImgUrl(blueprintImage);
      }
    };
    getImgUrl();
  }, [project?.videoUrl, setImgUrl]);

  return (
    <Card className="h-[340px] w-[500px]">
      <CardHeader className="grid grid-cols-2 text-center">
        <div className="flex flex-col justify-center gap-2">
          <CardTitle className="break-all text-lg">{project.name}</CardTitle>
          <CardDescription className="break-all text-sm text-neutral-600">
            {project.pitch}
          </CardDescription>
        </div>
        <div>
          <CardTitle className="text-lg">{project.hackathon.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="mx-auto -mt-3 grid w-full grid-cols-2 gap-4">
        <Image
          src={imgUrl}
          width={400}
          height={300}
          priority={true}
          alt="Thumbnail"
          className="h-full w-full rounded-lg"
        />

        <div className="flex flex-col gap-3">
          <Badge
            className={`w-fit ${
              progress.isRunning ? "bg-green-600" : "bg-sky-600"
            } mx-auto`}
          >
            <span className="w-full text-center text-lg">
              {progress.status}
            </span>
          </Badge>
          {project.participants.length === 0 ? (
            <p className="text-center font-serif text-lg font-bold uppercase text-orange-700">
              SOLOING
            </p>
          ) : project.creatorId === userId ? (
            <p className="text-center font-serif text-lg font-bold uppercase text-sky-700">
              As team leader
            </p>
          ) : (
            <p className="text-center font-serif text-lg font-bold uppercase text-sky-700">
              As team member
            </p>
          )}
          {project.isSubmitted ? (
            <Badge
              variant="outline"
              className="font-boldnormal mx-auto w-fit rounded-lg bg-slate-800 px-4 text-lg uppercase text-slate-100"
            >
              submitted
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="font-boldnormal mx-auto w-fit rounded-lg bg-slate-800 px-4 text-lg uppercase text-slate-100"
            >
              Not submitted
            </Badge>
          )}
          {progress.isRunning ? (
            <Button
              className="mx-auto mt-2 w-fit border-2 border-slate-950 bg-slate-100 px-4 text-xl font-bold text-slate-950 hover:text-slate-100"
              onClick={() =>
                router.push(`/dashboard/projects/edit?pid=${project.id}`)
              }
            >
              Edit project
            </Button>
          ) : (
            <Button
              className="mx-auto mt-2 w-fit border-2 border-slate-950 bg-slate-100 px-4 text-xl font-bold text-slate-950 hover:text-slate-100"
              onClick={() =>
                router.push(`/dashboard/projects/view?pid=${project.id}`)
              }
            >
              View project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
