"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "./ui/ui-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { TSignInSchema, signInSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import GoogleLogo from "@/components/images/google.png";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isCognitoLoading, setIsCognitoLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: TSignInSchema) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });

    if (!res?.error) {
      const session = await getSession();
      if (session?.user.isAdmin === true) {
        router.push("/manager");
        router.refresh();
      } else {
        router.push("/dashboard/hackathons");
        router.refresh();
      }
    } else {
      setError("email", {
        type: "server",
        message: "Invalid email or password",
      });
    }
  };

  const onGitHubSignIn = () => {
    setIsGitHubLoading(true);
    signIn("github", {
      callbackUrl: "/",
    });
  };

  const onGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", {
      callbackUrl: "/",
    });
  };

  // const onCognitoSignIn = () => {
  //   setIsCognitoLoading(true);
  //   signIn("cognito", {
  //     callbackUrl: "/",
  //   });
  // };


  const onCognitoSignIn = async () => {
    try {
      console.log("Attempting Cognito sign-in...");
      setIsCognitoLoading(true);
      
      // Call the signIn method for Cognito
      const result = await signIn("cognito", {
        callbackUrl: "/"
      });

      // Log the result to check for any issues
      console.log('Cognito sign-in result:', result);
      
      if (result?.error) {
        console.error("Cognito sign-in error:", result.error);
      } else if (result?.url) {
        router.push(result.url);
      }

    } catch (error) {
      console.error("Cognito sign-in error:", error);
    } finally {
      setIsCognitoLoading(false);
    }
  };


  return (
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl"> Sign in</CardTitle>
            <CardDescription>Sign in and start your journey!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground bg-white px-2">
                  Continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              {/* <Button
                type="button"
                className="w-full border-2 border-black"
                variant={"outline"}
                onClick={onGitHubSignIn}
                disabled={isGitHubLoading}
              >
                {isGitHubLoading ? (
                  <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <Icons.gitHub className="mr-3 h-5 w-5" />
                )}
                Github
              </Button>

              <Button
                type="button"
                className="w-full border-2 border-black"
                variant={"outline"}
                onClick={onGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Icons.spinner className="mr-3 h-4 w-4 animate-spin" />
                ) : (
                  <Image
                    src={GoogleLogo}
                    className="mr-3"
                    alt="Google Logo"
                    width={20}
                    height={20}
                  />
                )}
                Google
              </Button> */}

              <Button
                type="button"
                className="w-full border-2 border-black"
                variant={"outline"}
                onClick={onCognitoSignIn}
                disabled={isCognitoLoading}
              >
                {isCognitoLoading ? (
                  <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <Icons.logo className="mr-3 h-5 w-5" />
                )}
                Cognito
              </Button>

            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-muted-foreground mt-2 px-2 text-center text-sm">
              By clicking Sign In, you agree to our{" "}
              <Link
                href="/terms"
                className="hover:text-primary underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="hover:text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
