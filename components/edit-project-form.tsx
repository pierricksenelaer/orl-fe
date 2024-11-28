"use client";

import { TEditProjectSchema, editProjectSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Tiptap from "./richTextEditor";
import { Button } from "./ui/button";
import { Icons } from "./ui/ui-icons";
import { useRouter } from "next/navigation";
import Select from "react-select";
import techStackOptions from "@/lib/techStackOptions.json";
import makeAnimated from "react-select/animated";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import parse from "html-react-parser";
import { Separator } from "./ui/separator";
import { VideoPlayer } from "./videoPlayer";
import { Send } from "lucide-react";
import { ca } from "date-fns/locale";
import { set } from "date-fns";

type EditProjectFormValues = z.infer<typeof editProjectSchema>;
const defaultValues: Partial<EditProjectFormValues> = {};
type TechStackItem = {
  label: string;
  value: string;
};
type ValidationData = {
  name: string | null;
  pitch: string | null;
  techStack: TechStackItem[] | [];
  repositoryUrl: string | null;
  videoUrl?: string | null;
  story: string | null;
};
export default function EditProjectForm({
  userId,
  project,
  setProject,
}: {
  userId: string;
  project: any;
  setProject: any;
}) {
  const router = useRouter();
  const form = useForm<TEditProjectSchema>({
    resolver: zodResolver(editProjectSchema),
    defaultValues,
    mode: "onChange",
  });
  const animatedComponents = makeAnimated();
  const { toast } = useToast();

  const [storyContent, setStoryContent] = useState<string>("");
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (project) {
      form.setValue("name", project.name);
      form.setValue("pitch", project.pitch);
      form.setValue("techStack", project.techStack);
      form.setValue("repositoryUrl", project.repositoryUrl);
      form.setValue("videoUrl", project.videoUrl);
      setStoryContent(project.story);
      setIsSubmitted(project.isSubmitted);
      setIsCreator(project.creatorId === userId);
    }
  }, [project, form, userId]);

  const onUpdate = async (data: TEditProjectSchema) => {
    if (!project.id) {
      toast({
        variant: "destructive",
        title: "No project id found",
        description: "Please select a project first.",
      });
      return;
    }

    const projectData = {
      ...data,
      story: storyContent,
      projecId: project.id,
      userId,
    };
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        body: JSON.stringify(projectData),
      });

      if (res.ok) {
        setProject({
          ...project,
          name: projectData.name,
          pitch: projectData.pitch,
          techStack: projectData.techStack,
          repositoryUrl: projectData.repositoryUrl,
          videoUrl: projectData.videoUrl,
          story: projectData.story,
        });
        toast({
          title: "Success!",
          description: "Your project has been updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update project",
          description: res.statusText,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateProjectData = (validationData: ValidationData) => {
    let errorMessage = "";
    const errorNames = {
      name: "Name",
      pitch: "Pitch",
      techStack: "Tech Stack",
      repositoryUrl: "Github Link",
      videoUrl: "Video Link",
      story: "Story",
    };

    const validateProperty = (
      propertyName: keyof ValidationData,
      propertyValue: any,
    ) => {
      if (propertyValue === null || propertyValue === undefined) {
        errorMessage = errorMessage
          ? errorMessage + ",  " + errorNames[propertyName]
          : errorNames[propertyName];
      } else if (
        (typeof propertyValue === "string" &&
          (propertyValue.trim() === "" ||
            propertyValue.trim() === "<p></p>")) ||
        (Array.isArray(propertyValue) && propertyValue.length === 0)
      ) {
        errorMessage = errorMessage
          ? errorMessage + ",  " + errorNames[propertyName]
          : errorNames[propertyName];
      }
    };

    Object.keys(validationData).forEach((propertyName) => {
      validateProperty(
        propertyName as keyof ValidationData,
        validationData[propertyName as keyof ValidationData],
      );
    });

    if (errorMessage !== "") {
      setErrorMessage(errorMessage);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/projects/${project.id}`);
      if (res.ok) {
        const data = await res.json();
        const validationData = {
          name: data.name,
          pitch: data.pitch,
          techStack: data.techStack,
          repositoryUrl: data.repositoryUrl,
          // videoUrl: data.videoUrl,
          story: data.story,
        };
        const isValid = validateProjectData(validationData);
        if (!isValid) {
          setIsSubmitting(false);
          return;
        } else {
          await submitProject(project.id);
          setIsSubmitting(false);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Failed to submit project",
          description:
            "Failed to retrieve project data, please try again later.",
        });
        setOpenSubmitDialog(false);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/submit`, {
        method: "POST",
        body: JSON.stringify({
          projectId,
          userId,
        }),
      });
      if (res.ok) {
        toast({
          title: "Success!",
          description: "Your project has been submitted.",
        });
        setOpenSubmitDialog(false);
        setIsSubmitted(true);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to submit project",
          description: "Failed to submit project, please try again later.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <div className="flex items-center justify-between">
        <Dialog>
          <div className="-mt-2 flex items-center gap-3">
            <DialogTrigger asChild>
              <Button className="w-fit bg-slate-200 px-6 py-6 font-mono text-xl font-extrabold text-slate-950 hover:bg-slate-300">
                Preview
              </Button>
            </DialogTrigger>
            <TooltipProvider>
              <Tooltip delayDuration={30}>
                <TooltipTrigger asChild>
                  <Button className="-px-2 -py-2 h-5 w-5 rounded-full bg-slate-300 text-lg font-extrabold text-slate-700 hover:bg-slate-400 hover:text-slate-100">
                    ?
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-md w-52 font-medium">
                    Please update the project before preview to see the changes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <DialogContent className="container h-full overflow-y-scroll bg-slate-900 sm:min-w-[500px] md:min-w-[600px] lg:min-w-[800px] xl:min-w-[1000px]	">
            <DialogHeader className="-mb-16 mt-5 text-slate-900">
              <DialogTitle className="text-center text-3xl font-bold text-slate-100">
                {project.name}
              </DialogTitle>
              <DialogDescription className="text-md text-center font-normal text-slate-300">
                {project.pitch}
              </DialogDescription>
            </DialogHeader>
            {project.videoUrl && (
              <>
                <div className="break-all">
                  <h1 className="font-mono text-2xl font-semibold">Video</h1>
                  <Separator className="mt-2" />
                  <VideoPlayer
                    videoUrl={project.videoUrl}
                    width={"640"}
                    height={"380"}
                  />
                </div>
              </>
            )}

            <div className="break-all">
              <h1 className="font-mono text-2xl font-semibold">Story</h1>
              <Separator className="mt-2" />
              <div className="mt-3">{parse(project.story)}</div>
            </div>

            <div className="break-all">
              <h1 className="font-mono text-2xl font-semibold">Tech stack</h1>
              <Separator className="mt-2" />
              <div className="mt-2 flex gap-3">
                {project.techStack.map((tech: any) => {
                  return (
                    <div
                      className="rounded-lg bg-sky-600 px-2 py-1 font-medium text-slate-100"
                      key={tech.label}
                    >
                      {tech.value}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="break-all">
              <h1 className="font-mono text-2xl font-semibold">
                Github repository
              </h1>
              <Separator className="mt-2" />
              <div className="mt-2 flex gap-3">
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  className="hover:underline"
                >
                  {project.repositoryUrl}
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {isSubmitted ? (
          <div className="w-34 flex items-center gap-4">
            <div className="flex-col text-center">
              <h1 className="">Your project is submitted.</h1>
              <p> Thank you.</p>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={30}>
                <TooltipTrigger asChild>
                  <Button className="-px-2 -py-2 h-5 w-5 rounded-full bg-slate-300 text-lg font-extrabold text-slate-700 hover:bg-slate-400 hover:text-slate-100">
                    ?
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-md w-60 font-medium">
                    The creator of this project is still allowed to edit your
                    project until the end of hackathon.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          project.creatorId === userId && (
            <div className="flex items-center gap-2">
              <Button
                className="w-fit bg-green-600 px-4 py-6 font-mono text-xl font-extrabold hover:bg-slate-100 hover:text-slate-950"
                onClick={() => {
                  setOpenSubmitDialog((prev) => !prev);
                  setErrorMessage("");
                }}
              >
                <Send className="mr-2 h-5 w-5" /> Submit
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
                      Submit your project. <br />
                      Only submitted projects are visible to reviewers.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        )}
        <Dialog open={openSubmitDialog} onOpenChange={setOpenSubmitDialog}>
          <DialogContent className="min-w-[550px] bg-slate-100	">
            <DialogHeader className="text-slate-900">
              {errorMessage === "" ? (
                <DialogTitle className="text-center text-2xl font-bold text-slate-800">
                  Submit your project
                </DialogTitle>
              ) : (
                <DialogTitle className="text-center text-2xl font-bold text-red-500">
                  Submission error
                </DialogTitle>
              )}
            </DialogHeader>

            {errorMessage === "" ? (
              <div className="mb-2">
                <p className="mt-2 text-center text-lg font-medium text-slate-800">
                  Your project will be publicly visible once submitted.
                </p>
                <p className="mt-2 text-center text-lg font-medium text-slate-800">
                  You can still edit before the end date of the hackathon.{" "}
                </p>
                <h1 className="text-mdl mt-4 text-center text-slate-900">
                  Click confirm to submit your project
                </h1>
              </div>
            ) : (
              <div className="flex flex-col justify-center text-center">
                <h1 className="text-xl text-slate-900">
                  Following fields are required to be filled before submission:
                </h1>
                <p className="text-xl font-bold text-red-500">{errorMessage}</p>
                <p className="text-md mt-5 font-mono text-amber-700">
                  Make sure you update your changes before submitting
                </p>
              </div>
            )}
            <DialogFooter className="flex gap-4">
              <DialogClose asChild>
                <Button className="mr-1" variant={"destructive"}>
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
      </div>

      <div className="mt-6 space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md flex w-1/2 justify-between">
                <p>Name</p>
                <p className="text-slate-400">
                  {40 - (form.watch("name")?.length || 0)} characters left
                </p>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Project name"
                  {...field}
                  className="w-1/2 text-lg text-black"
                  disabled={!isCreator}
                  maxLength={40}
                />
              </FormControl>
              <FormDescription className="text-slate-100">
                This is the name of your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pitch"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md flex justify-between">
                <p>Project pitch/tagline</p>
                <p className="text-slate-400">
                  {60 - (form.watch("pitch")?.length || 0)} characters left
                </p>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Pitch line"
                  {...field}
                  className="text-lg text-black"
                  disabled={!isCreator}
                  maxLength={60}
                />
              </FormControl>
              <FormDescription className="text-slate-100">
                Create a pitch line for your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h1 className="text-md mb-2 font-semibold">Story</h1>
          <Tiptap
            content={storyContent}
            setContent={setStoryContent}
            placeholder="Description of the hackathon. e.g. Introduction, about the company, schedules."
            isCreator={isCreator}
          />
          <p className="mt-2 text-sm text-slate-100">
            Please write down the story of the project, what it does, how did
            you build your project, what challenges you faced, what you learned,
            accomplishments that you&apos;re proud of, what&apos;s next for your
            project.
          </p>
        </div>

        <div>
          <h1 className="text-md mb-2 font-semibold">Tech stack</h1>
          <Controller
            name="techStack"
            control={form.control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  isMulti
                  options={techStackOptions}
                  placeholder="Select tags..."
                  components={animatedComponents}
                  className="font-semibold text-black"
                  instanceId={field.name}
                  isDisabled={!isCreator}
                />
                <p className="mt-2 text-red-600">
                  {form.formState.errors.techStack &&
                    form.formState.errors.techStack.message}
                </p>
              </>
            )}
          />
          <p className="mt-2 text-sm text-slate-100">
            What languages, frameworks, databases did you use?
          </p>
        </div>
        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Repository link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Github link..."
                  {...field}
                  className="w-full text-lg text-black"
                  disabled={!isCreator}
                />
              </FormControl>
              <FormDescription className="text-slate-100">
                Add link for your project repo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Video link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Youtube or Vimeo video URL..."
                  {...field}
                  className="w-full text-lg text-black"
                  disabled={!isCreator}
                />
              </FormControl>
              <FormDescription className="text-slate-100">
                Video link to showcase your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center gap-6">
          <Button
            type="submit"
            className="bg-slate-200 p-6 text-lg text-slate-950 hover:bg-slate-300"
            disabled={form.formState.isSubmitting || !isCreator}
            onClick={form.handleSubmit(onUpdate)}
          >
            {form.formState.isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update
          </Button>
          <div
            className="ml-6 cursor-pointer text-center text-lg font-bold text-red-600 hover:underline "
            onClick={() => router.push("/dashboard/projects")}
          >
            Cancel
          </div>
        </div>
        {!isCreator && (
          <div className="text-md flex w-full -translate-x-10 -translate-y-4 flex-col text-center text-red-500">
            <p>
              You are not allowed to edit this project as a teammate. <br />{" "}
              Please contact the project owner for any updates.
            </p>
          </div>
        )}
      </div>
    </Form>
  );
}
