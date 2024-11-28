"use client";

import { TCreateProjectSchema, createProjectSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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

type CreatProjectFormValues = z.infer<typeof createProjectSchema>;
const defaultValues: Partial<CreatProjectFormValues> = {};
export default function CreateProjectForm({
  userId,
  hackathonId,
}: {
  userId: string;
  hackathonId: string;
}) {
  const router = useRouter();
  const form = useForm<TCreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
    mode: "onChange",
  });
  const animatedComponents = makeAnimated();
  const { toast } = useToast();

  const [storyContent, setStoryContent] = useState<string>("");

  const onSubmit = async (data: TCreateProjectSchema) => {
    if (!hackathonId) {
      toast({
        variant: "destructive",
        title: "No hackathon id found",
        description: "Please select a hackathon first.",
      });
      return;
    }

    const projectData = {
      ...data,
      story: storyContent,
      hackathonId,
      userId,
    };
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        toast({
          title: "Success!",
          description: "A new project has been created.",
        });
        router.push("/dashboard/projects");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create project",
          description: res.statusText,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  className="w-1/2 text-lg text-black"
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
            isCreator={true}
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
                />
              </FormControl>
              <FormDescription className="text-slate-100">
                Video link to showcase your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className="bg-slate-200 p-6 text-lg text-slate-950 hover:bg-slate-300"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
          <div
            className="ml-6 cursor-pointer text-center text-lg font-bold text-red-500 underline"
            onClick={() => router.back()}
          >
            Cancel
          </div>
        </div>
      </form>
    </Form>
  );
}
