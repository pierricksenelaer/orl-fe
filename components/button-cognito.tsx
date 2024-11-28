'use client'
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/ui-icons";

export default function CognitoButton() {
  
  const [isCognitoLoading, setIsCognitoLoading] = useState<boolean>(false);
  
  const onCognitoSignIn = () => {
      setIsCognitoLoading(true);
      console.log("Attempting Cognito sign-in...");
      signIn("cognito", {
        callbackUrl: "/",
      });
    };

  return (
    <Button
      type="button"
      className="w-full border-2 border-black"
    //   variant={"outline"}
      onClick={onCognitoSignIn}
      disabled={isCognitoLoading}
    >
      {isCognitoLoading ? (
        <Icons.spinner className="mr-3 h-5 w-5 animate-spin" />
      ) : (
        <Icons.logo className="mr-3 h-5 w-5" />
      )}
      SIGN IN
    </Button>
  );
}