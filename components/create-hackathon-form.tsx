"use client";
import {
  Prize,
  TCreateHackathonSchema,
  createHackathonSchema,
} from "@/lib/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useMemo } from "react";
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

type CreateHackathonFormValues = z.infer<typeof createHackathonSchema>;

const defaultValues: Partial<CreateHackathonFormValues> = {};

export default function CreateHackathonForm({
  creatorId,
}: {
  creatorId: string;
}) {
  const router = useRouter();
  const [descriptionContent, setDescriptionContent] = useState<string>("");
  const [requirementContent, setRequirementContent] = useState<string>("");
  const [rulesContent, setRulesContent] = useState<string>("");
  const [resourcesContent, setResourcesContent] = useState<string>("");
  const [judgesContent, setJudgesContent] = useState<string>("");
  const [partnersContent, setPartnersContent] = useState<string>("");
  const [prizeList, setPrizeList] = useState<Prize[]>([]);
  const [timeZone, setTimeZone] = useState<string>("");
  const [timeZoneSelect, setTimeZoneSelect] = useState<any>("");

  useEffect(() => {
    setTimeZoneSelect({ value: timeZone });
  }, [timeZone]);

  const form = useForm<TCreateHackathonSchema>({
    resolver: zodResolver(createHackathonSchema),
    defaultValues,
    mode: "onChange",
  });

  const { toast } = useToast();

  const onSubmit = async (data: TCreateHackathonSchema) => {
    const formData = {
      ...data,
      managerEmail: data.email,
      descriptionContent,
      requirementContent,
      rulesContent,
      resourcesContent,
      judgesContent,
      partnersContent,
      prizes: prizeList,
      creatorId,
    };
    try {
      const res = await fetch("/api/manage/hackathons/create", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.refresh();
        router.push("/manager");
        toast({
          title: "Success!",
          description: "A new hackathon has been created.",
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

  return (
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
        <div>
          <h1 className="text-md mb-2 font-semibold">Description</h1>
          <Tiptap
            content={descriptionContent}
            setContent={setDescriptionContent}
            placeholder="Description of the hackathon. e.g. Introduction, about the company, schedules."
            isCreator={true}
          />
          <p className="mt-2 text-sm text-slate-100">
            Description of the hackathon. e.g. Introduction, about the company,
            schedules.
          </p>
        </div>
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
            Resources for the hackathon that can be helpful for participants.
            e.g. technical support tools, links, additional documents, etc.
          </p>
        </div>
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
        <div>
          <h1 className="mb-1 text-lg font-semibold dark:text-white">Prizes</h1>
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
            <PlusCircle className=" h-4 w-4" />
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
                          <FormLabel className="text-md">Start date</FormLabel>
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
            Create
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
  );
}
