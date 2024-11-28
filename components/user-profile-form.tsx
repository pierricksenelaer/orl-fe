"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TUserProfileSchema, userProfileSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import techStackOptions from "@/lib/techStackOptions.json";
import { roleOptions } from "@/lib/roleOptions.js";
import { Icons } from "./ui/ui-icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { UploadAvatar } from "./upload-avatar";

export default function UserProfileForm({
  userId,
}: {
  userId: string | undefined;
}) {
  const defaultValues: Partial<TUserProfileSchema> = {
    name: "",
    items: ["recents", "home"],
  };
  const animatedComponents = makeAnimated();
  const { toast } = useToast();
  const { data: session, update } = useSession();
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [avatarImg, setAvatarImg] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  const form = useForm<TUserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await fetch("/api/users/profile");
        const data = await res.json();
        setUser(data);
        form.setValue("name", data.name);
        form.setValue("role", data.userPreference.role);
        form.setValue("skills", data.userPreference.skills);
        setAvatarImg(data.userPreference.avatar);
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [userId, form]);

  const handleConfirmAvatarEditor = () => {
    setAvatarImg(preview);
  };
  const onSubmit = async (data: TUserProfileSchema) => {
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: data.name,
          role: data.role,
          skills: data.skills,
          avatar: avatarImg,
        }),
      });
      if (res.ok) {
        await update({
          name: data.name,
        });
        toast({
          title: "Success!",
          description: "We have updated your profile.",
        });
      } else {
        toast({
          title: "failed!",
          variant: "destructive",
          description:
            "We are not able to update your profile. Please try again",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        {user && (
          <Dialog>
            <div className="-mt-2 flex items-center gap-4">
              <DialogTrigger asChild>
                <Avatar className="h-20 w-20 cursor-pointer hover:ring-2 hover:ring-teal-300">
                  <AvatarImage src={avatarImg} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold text-slate-950">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <p className="text-md w-40">Click to change your avatar</p>
            </div>
            <DialogContent>
              <DialogHeader className="text-xl font-bold text-slate-950">
                Change your avatar
              </DialogHeader>
              <UploadAvatar setPreview={setPreview} preview={preview} />
              <DialogFooter className="flex gap-4">
                <DialogClose asChild>
                  <Button className="mr-1" variant={"destructive"}>
                    <span>Cancel</span>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={handleConfirmAvatarEditor}
                    className="bg-green-700"
                  >
                    <span>Confirm</span>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-1/2 min-w-[200px]">
              <FormLabel className="text-md">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="user name"
                  {...field}
                  className="text-lg font-bold text-black"
                />
              </FormControl>
              <FormDescription className="text-slate-300">
                Your user name will be displayed publicly
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h1 className="text-md mb-2 font-semibold">Your specialty</h1>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={roleOptions}
                  placeholder="Select tags..."
                  components={animatedComponents}
                  className="w-full min-w-[200px] font-semibold text-black md:w-1/2"
                  instanceId={field.name}
                />
                <p className="mt-2 text-red-600">
                  {form.formState.errors.role &&
                    form.formState.errors.role.message}
                </p>
              </>
            )}
          />
        </div>

        <div>
          <h1 className="text-md mb-2 font-semibold">Skills</h1>
          <Controller
            name="skills"
            control={form.control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  isMulti
                  options={techStackOptions}
                  placeholder="Select tags..."
                  components={animatedComponents}
                  className="w-full min-w-[200px] font-semibold text-black md:w-2/3"
                  instanceId={field.name}
                />
                <p className="mt-2 text-red-600">
                  {form.formState.errors.skills &&
                    form.formState.errors.skills.message}
                </p>
              </>
            )}
          />
          <p className="mt-2 text-sm text-slate-100">
            What languages, frameworks, databases did you use?
          </p>
        </div>

        <div className="flex gap-10 ">
          <Button
            type="submit"
            className="hover: bg-slate-200 text-lg text-slate-950 hover:bg-slate-300"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update profile
          </Button>
          <Button
            variant="destructive"
            className="text-lg"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
          >
            Back
          </Button>
        </div>
      </div>
    </Form>
  );
}
