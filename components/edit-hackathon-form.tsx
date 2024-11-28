"use client";

import { TCreateHackathonSchema, createHackathonSchema } from "@/lib/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Tiptap from "./richTextEditor";
import { useRouter } from "next/navigation";
import { PrizeCard } from "./prizeCard";
import CreatePrizeForm from "./create-prize-form";
import TimezoneSelect from "react-timezone-select";
import { Icons } from "./ui/ui-icons";
import { useToast } from "./ui/use-toast";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "./ui/card";
import { PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Dialog, DialogContent } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import parse from "html-react-parser";
import LaunchHackathonDialog from "./launch-hackathon-dialog";

type CreateHackathonFormValues = z.infer<typeof createHackathonSchema>;
const defaultValues: Partial<CreateHackathonFormValues> = {};

export type Prize = {
  id: string;
  name: string;
  value: string;
  numberOfWinningTeams: string;
  description: string;
  isEditing?: boolean;
};

export default function EditHackathonForm({ hackathon }: { hackathon: any }) {
  const router = useRouter();
  const { toast } = useToast();

  const [descriptionContent, setDescriptionContent] = useState<string>("");
  const [requirementContent, setRequirementContent] = useState<string>("");
  const [rulesContent, setRulesContent] = useState<string>("");
  const [resourcesContent, setResourcesContent] = useState<string>("");
  const [judgesContent, setJudgesContent] = useState<string>("");
  const [partnersContent, setPartnersContent] = useState<string>("");
  const [prizeList, setPrizeList] = useState<Prize[]>([]);
  const [timeZone, setTimeZone] = useState<string>("");
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openLaunchDialog, setOpenLaunchDialog] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [timeZoneSelect, setTimeZoneSelect] = useState<any>(timeZone);

  useEffect(() => {
    setTimeZoneSelect({ value: timeZone });
  }, [timeZone]);

  const form = useForm<TCreateHackathonSchema>({
    resolver: zodResolver(createHackathonSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (hackathon) {
      form.setValue("name", hackathon.name);
      form.setValue("tagline", hackathon.tagline);
      form.setValue("email", hackathon.managerEmail);
      form.setValue("location", hackathon.location);
      form.setValue("startDate", hackathon.startDate);
      form.setValue("endDate", hackathon.endDate);
      //Tiptap content
      setIsLaunched(hackathon.launched);
      setDescriptionContent(hackathon.description || " ");
      setRequirementContent(hackathon.requirements || " ");
      setRulesContent(hackathon.rules || " ");
      setResourcesContent(hackathon.resources || " ");
      setJudgesContent(hackathon.judges || " ");
      setPartnersContent(hackathon.partners || " ");
      setPrizeList(hackathon.prizes);
      setTimeZone(hackathon.timeZone);
    }
  }, [
    hackathon,
    form,
    setDescriptionContent,
    setRequirementContent,
    setRulesContent,
    setResourcesContent,
    setJudgesContent,
    setPartnersContent,
    setPrizeList,
    setTimeZone,
  ]);

  const onSubmit = async (data: TCreateHackathonSchema) => {
    const formData = {
      ...data,
      managerEmail: data.email,
      description: descriptionContent,
      requirements: requirementContent,
      rules: rulesContent,
      resources: resourcesContent,
      judges: judgesContent,
      partners: partnersContent,
      prizes: prizeList,
      timeZone: timeZone,
      hackathonId: hackathon.id,
    };

    try {
      const res = await fetch("/api/manage/hackathons", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        toast({
          title: "Success!",
          description: "Updated your hackathon.",
        });
      }
    } catch (error) {
      console.error("Error creating hackathon:", error);
      throw new Error("Failed to create hackathon");
    }
  };
  const addPrize = () => {
    const prize = {
      id: uuid(),
      name: "",
      value: "0",
      numberOfWinningTeams: "1",
      description: "",
      idEditing: true,
    };

    const updatedPrizeList = Array.isArray(prizeList)
      ? [...prizeList, prize]
      : [prize];
    setPrizeList(updatedPrizeList);
  };

  const removeElement = (
    prize: Prize,
    prizeList: Prize[],
    setPrizeList: any,
  ) => {
    const newPrizeList = prizeList.filter((elm) => elm.id !== prize.id);
    setPrizeList(newPrizeList);
  };

  const handleClickPreview = () => {
    setOpenPreviewDialog(true);
  };

  const handleClickLaunch = () => {
    setOpenLaunchDialog((prev) => !prev);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            className="w-fit bg-slate-200 px-6 py-6 font-mono  text-xl font-extrabold text-slate-950 hover:bg-slate-300"
            onClick={handleClickPreview}
          >
            Preview
          </Button>

          <TooltipProvider>
            <Tooltip delayDuration={30}>
              <TooltipTrigger asChild>
                <Button className="-px-2 -py-2 h-5 w-5 rounded-full bg-slate-300 text-lg font-extrabold text-slate-700 hover:bg-slate-400 hover:text-slate-100">
                  ?
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-md w-52 font-medium">
                  Please update the hackathon before preview to see the changes.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isLaunched ? (
          <div className="flex flex-col text-center">
            <h1 className="text-md font-bold">Your hackathon is launched.</h1>
            <p className="text-md font-bold">Thank you.</p>
          </div>
        ) : (
          <Button
            className="w-fit bg-lime-600 px-6 py-6 text-xl font-extrabold"
            onClick={handleClickLaunch}
          >
            🚀 Launch Hackathon
          </Button>
        )}
      </div>
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md flex justify-between">
                  <p>Name</p>
                  <p className="text-slate-400">
                    {60 - (form.watch("name")?.length || 0)} characters left
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Hackathon name"
                    {...field}
                    className="text-lg font-bold text-black"
                    maxLength={60}
                  />
                </FormControl>
                <FormDescription className="text-slate-100">
                  This is the name of your public hackathon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md flex justify-between">
                  <p>Tagline</p>
                  <p className="text-slate-400">
                    {60 - (form.watch("tagline")?.length || 0)} characters left
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tagline"
                    {...field}
                    className="text-lg font-bold text-black"
                    maxLength={60}
                  />
                </FormControl>
                <FormDescription className="text-slate-100">
                  Create a tagline for the hackathon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">Contact email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    className="text-lg font-bold text-black"
                  />
                </FormControl>
                <FormDescription className="text-slate-100">
                  Participants can use this email to contact the manager of the
                  hackathon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md flex justify-between">
                  <p>Location</p>
                  <p className="text-slate-400">
                    {25 - (form.watch("location")?.length || 0)} characters left
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Virtual or in-person, e.g.(Toronto, Canada, campus)"
                    {...field}
                    className="text-lg font-bold text-black"
                    maxLength={25}
                  />
                </FormControl>
                <FormDescription className="text-slate-100">
                  Location of the hackathon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {descriptionContent && (
            <div>
              <h1 className="text-md mb-2 font-semibold">Description</h1>
              <Tiptap
                content={descriptionContent}
                setContent={setDescriptionContent}
                placeholder="Description of the hackathon. e.g. Introduction, about the company, schedules."
                isCreator={true}
              />
              <p className="mt-2 text-sm text-slate-100">
                Description of the hackathon. e.g. Introduction, about the
                company, schedules.
              </p>
            </div>
          )}
          {requirementContent && (
            <div>
              <h1 className="text-md mb-2 font-semibold">Requirements</h1>
              <Tiptap
                content={requirementContent}
                setContent={setRequirementContent}
                placeholder="Requirements for building the hackathon project and what the
            participants needed when submitting."
                isCreator={true}
              />
              <p className="mt-2 text-sm text-slate-100">
                Requirements for building the hackathon project and what the
                participants needed when submitting.
              </p>
            </div>
          )}
          {rulesContent && (
            <div>
              <h1 className="text-md mb-2 font-semibold">Rules</h1>
              <Tiptap
                content={rulesContent}
                setContent={setRulesContent}
                placeholder="Rules of the contest. Inculding legal requirements and code of
            conduct."
                isCreator={true}
              />
              <p className="mt-2 text-sm text-slate-100">
                Rules of the contest. Inculding legal requirements and code of
                conduct.
              </p>
            </div>
          )}
          {resourcesContent && (
            <div>
              <h1 className="text-md mb-2 font-semibold">Resources</h1>
              <Tiptap
                content={resourcesContent}
                setContent={setResourcesContent}
                placeholder="Resources for the hackathon that can be helpful for participants.
            e.g. technical support tools, links, additional documents, etc."
                isCreator={true}
              />
              <p className="mt-2 text-sm text-slate-100">
                Resources for the hackathon that can be helpful for
                participants. e.g. technical support tools, links, additional
                documents, etc.
              </p>
            </div>
          )}
          {judgesContent && (
            <div>
              <h1 className="text-md mb-2 font-semibold">Judges</h1>
              <Tiptap
                content={judgesContent}
                setContent={setJudgesContent}
                placeholder="Information of judges. e.g. name, title, personal link."
                isCreator={true}
              />
              <p className="mt-2 text-sm text-slate-100">
                Information of judges. e.g. name, title, personal link.
              </p>
            </div>
          )}
          {partnersContent && (
            <div>
              <h1 className="text-md mb-2 font-semibold">Partners</h1>
              <Tiptap
                content={partnersContent}
                setContent={setPartnersContent}
                placeholder="Information of partners. e.g. name, description, link."
                isCreator={true}
              />
              <p className="mt-2 text-sm text-slate-100">
                Information of partners. e.g. name, description, link.
              </p>
            </div>
          )}

          <div>
            <h1 className="mb-1 text-lg font-semibold dark:text-white">
              Prizes
            </h1>
            <div className="flex flex-col gap-2">
              {Array.isArray(prizeList) &&
                prizeList.map((prize) => {
                  return prize.isEditing ? (
                    <CreatePrizeForm
                      prize={prize}
                      removeElement={removeElement}
                      prizeList={prizeList}
                      setPrizeList={setPrizeList}
                      key={prize.id}
                    />
                  ) : (
                    <PrizeCard
                      key={prize.id}
                      prize={prize}
                      removeElement={removeElement}
                      prizeList={prizeList}
                      setPrizeList={setPrizeList}
                    />
                  );
                })}
            </div>
            <Button
              type="submit"
              onClick={addPrize}
              className="mt-2 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create prize
            </Button>
          </div>

          <Card className="w-fit">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-6 md:flex-row ">
                <div className="flex flex-col">
                  <Label htmlFor="date" className="shrink-0">
                    Pick start and end dates
                  </Label>
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Start date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="text-lg font-bold text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">End date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="text-lg font-bold text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex min-w-[240px] flex-col gap-2 ">
                  <Label htmlFor="date" className="shrink-0">
                    Pick a time zone
                  </Label>
                  <TimezoneSelect
                    value={timeZoneSelect}
                    onChange={(obj) => setTimeZone(obj.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="bg-slate-200 p-6 text-lg text-slate-900 hover:bg-slate-300"
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {form.formState.isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update
            </Button>
            <div
              className="ml-6 cursor-pointer text-center text-lg font-bold text-red-500 underline"
              onClick={() => router.push("/manager")}
            >
              Cancel
            </div>
          </div>
        </div>
      </Form>

      <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
        <DialogContent className="container h-full overflow-y-scroll bg-slate-900 sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px]  xl:min-w-[1200px]">
          <div className="h-full w-full justify-center px-4 py-6 lg:px-8">
            {hackathon && (
              <Tabs
                defaultValue="overview"
                className="h-full w-full space-y-6 "
              >
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
                  {/* <div className="text-lg flex mx-auto gap-4 w-full justify-center mt-6 items-center">
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <div className="font-semibold">Start Date:</div>
                    {hackathon.startDate}
                  </div>
                  <div className="flex gap-4">
                    <div className="font-semibold">End Date:</div>
                    {hackathon.endDate}
                  </div>
                </div>
                <Badge
                  className={`py-2  w-fit ${
                    progress.isRunning ? 'bg-green-600' : 'bg-sky-600'
                  }`}
                >
                  <span className="w-full text-center text-lg">
                    {progress.status}
                  </span>
                </Badge>
              </div> */}

                  <div className="mx-10 mt-5 flex flex-col py-6 text-xl lg:mx-20">
                    {parse(hackathon.description)}
                  </div>

                  <div className="mx-10 flex flex-col py-6 text-xl lg:mx-20">
                    <h1 className="font-bold uppercase tracking-wide">
                      Location
                    </h1>
                    <hr className="mt-2" />
                    <h6 className="mt-3">{hackathon.location}</h6>
                  </div>
                  <div className=" mx-10 flex flex-col py-6 text-xl lg:mx-20">
                    <h1 className="font-bold uppercase tracking-wide">
                      Requirements
                    </h1>
                    <hr className="mt-2" />
                    <div className="mt-3">{parse(hackathon.requirements)}</div>
                  </div>
                  <div className="mx-10 flex flex-col py-6 text-xl lg:mx-20">
                    <h1 className="font-bold uppercase tracking-wide">
                      Prizes
                    </h1>
                    <hr className="mt-2" />
                    <div className="mt-3 flex w-full gap-6">
                      {hackathon.prizes &&
                        Array.isArray(hackathon.prizes) &&
                        hackathon.prizes.map((prize: any, index: number) => {
                          return (
                            <div className="mx-auto w-full" key={index}>
                              <div>🏆 {prize.name}</div>
                              <div>🪙 ${prize.value}</div>
                              <div>
                                {prize.numberOfWinningTeams} winning teams
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="mx-10 flex flex-col py-6 text-xl lg:mx-20">
                    <h1 className="font-bold uppercase tracking-wide">
                      Judges
                    </h1>
                    <hr className="mt-2" />
                    <div className="mt-3">{parse(hackathon.judges)}</div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="rules"
                  className="flex w-full flex-col justify-center border-none p-0 outline-none "
                >
                  <div className="mx-10 mt-3 text-lg lg:mx-20">
                    {parse(hackathon.rules)}
                  </div>
                </TabsContent>
                <TabsContent
                  value="resources"
                  className="flex w-full flex-col justify-center border-none p-0 outline-none "
                >
                  <div className="mx-10 mt-3 text-lg lg:mx-20">
                    {parse(hackathon.resources)}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <LaunchHackathonDialog
        open={openLaunchDialog}
        onOpenChange={setOpenLaunchDialog}
        setOpenLaunchDialog={setOpenLaunchDialog}
        hackathonId={hackathon.id}
        setIsLaunched={setIsLaunched}
      />
    </>
  );
}
