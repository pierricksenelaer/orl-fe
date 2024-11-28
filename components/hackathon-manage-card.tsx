"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { convertDateString } from "@/helpers/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Hackathon = {
  id: string;
  name: string | null;
  tagline: string | null;
  timeZone: string | null;
  startDate: string | null;
  endDate: string | null;
  managerEmail: string | null;
  launched: boolean | null;
};

export default function HackathonManageCard({
  hackathon,
}: {
  hackathon: Hackathon;
}) {
  const [launched, setLaunched] = useState(false);
  const router = useRouter();

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const TABLE_ROWS = [
    {
      name: "Email:",
      content: hackathon.managerEmail,
    },
    {
      name: "Time zone:",
      content: hackathon.timeZone,
    },
    {
      name: "Start Date:",
      content: convertDateString(hackathon.startDate, options),
    },
    {
      name: "End Date:",
      content: convertDateString(hackathon.endDate, options),
    },
  ];

  const handleClickEdit = () => {
    router.push(`/manager/edit-hackathon?hid=${hackathon.id}`);
  };

  useEffect(() => {
    setLaunched(hackathon.launched || false);
  }, [hackathon, setLaunched]);

  return (
    <Card className="w-[500px]  break-all">
      <CardHeader>
        <CardTitle className="text-xl text-center">{hackathon.name}</CardTitle>
        <CardDescription className="text-lg text-center">
          {hackathon.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left min-w-max">
          <tbody>
            {TABLE_ROWS.map(({ name, content }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50l";

              return (
                <tr key={name} className="even:bg-blue-gray-50/50">
                  <td className={classes}>
                    <div className="font-semibold">{name}</div>
                  </td>
                  <td className={classes}>
                    <div className="font-normal font-roboto ">
                      {content as React.ReactNode}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 mx-4">
        <Button
          className="text-lg font-bold hover:underline"
          onClick={handleClickEdit}
        >
          Edit
        </Button>

        {launched ? (
          <p className="flex items-center font-bold text-green-600 uppercase">
            Live
          </p>
        ) : (
          <p className="flex items-center font-bold text-red-600 uppercase">
            Not live yet
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
