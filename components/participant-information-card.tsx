import { Participant } from "@/lib/types";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GraduationCap, UserPlus2, Wrench } from "lucide-react";

export default function ParticipantInformationCard({
  participant,
  setOpenInviteDialog,
  setSelectedUserId,
}: {
  participant: Participant;
  setOpenInviteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const maxTotalCharacterCount = 36;
  let totalCharacterCount = 0;

  const handleClick = () => {
    setOpenInviteDialog((prev) => !prev);
    setSelectedUserId(participant.id);
  };

  return (
    <>
      <Card className="h-[160px] w-[330px]">
        <CardHeader className="py-2">
          <div className="flex justify-between">
            <div className="flex items-center px-2">
              <Avatar className="mr-3 h-7 w-7">
                <AvatarImage
                  src={participant?.userPreference?.avatar || ""}
                  alt={participant.name}
                />
                <AvatarFallback className="bg-slate-700 text-xl font-semibold text-slate-100">
                  {participant.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="flex items-center text-xl font-bold">
                {participant.name}
              </span>
            </div>
            <Button
              className="group rounded-full bg-white px-3 py-0 hover:bg-slate-700"
              onClick={handleClick}
            >
              <UserPlus2 className="h-9 w-9 text-slate-800 group-hover:text-white" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="flex w-full items-center">
            <div>
              <GraduationCap className="mr-3 h-6 w-6 text-gray-600" />
            </div>
            <p className="text-lg font-medium">
              {participant?.userPreference?.role !== null
                ? participant?.userPreference?.role.label
                : "Not specified"}
            </p>
          </div>
          <div className="mt-2 flex w-full items-start">
            <div>
              <Wrench className="mr-3 h-6 w-6 self-start text-gray-600" />
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {participant?.userPreference?.skills !== null ? (
                participant?.userPreference?.skills.map(
                  (skill: any, index: number) => {
                    const skillLabel = skill.label;

                    if (skillLabel) {
                      const skillCharacterCount = skillLabel.length;

                      if (
                        totalCharacterCount + skillCharacterCount <=
                        maxTotalCharacterCount
                      ) {
                        totalCharacterCount += skillCharacterCount;
                        return (
                          <div key={skillLabel}>
                            <span className="rounded-xl bg-slate-700 px-2 py-1 text-sm font-medium text-slate-100">
                              {skillLabel}
                            </span>
                          </div>
                        );
                      } else if (
                        index ===
                        participant?.userPreference?.skills.length - 1
                      ) {
                        return (
                          <span
                            className="ml-2 text-lg font-bold text-slate-900"
                            key="spread"
                          >
                            ...
                          </span>
                        );
                      }
                    }

                    return null;
                  },
                )
              ) : (
                <span className="text-lg font-medium text-slate-900">
                  Not specified
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
