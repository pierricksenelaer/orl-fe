"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession, signIn } from "next-auth/react";

import { Button } from "./ui/button";
import { Icons } from "./ui/ui-icons";

import { useRouter } from "next/navigation";

import UserDropdownMenu from "./user-dropdown-menu";
import NotificationDropdownMenu from "./notification-dropdown-menu";

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [avatar, setAvatar] = useState<string>("");
  const router = useRouter();

  const [isCognitoLoading, setIsCognitoLoading] = useState<boolean>(false);

  const handleSignIn = () => {
    router.push("/auth/signIn");
  };

  const onCognitoSignIn = () => {
    setIsCognitoLoading(true);
    signIn("cognito", {
      callbackUrl: "/",
    });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signIn" });
  };

  const goToUserProfile = () => {
    router.push("/dashboard/users/profile");
  };

  useEffect(() => {
    const getUserNotifications = async () => {
      const res = await fetch("/api/users/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    };
    getUserNotifications();
  }, [setNotifications]);

  useEffect(() => {
    const getUserProfile = async () => {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        setAvatar(data.userPreference?.avatar);
      }
    };
    getUserProfile();
  }, [setAvatar]);

  return (
    <>
      {session ? (
        <div className="top container sticky flex w-full items-center justify-end rounded-lg px-6 py-6 transition-all">
          <UserDropdownMenu
            handleSignOut={handleSignOut}
            user={session.user}
            goToUserProfile={goToUserProfile}
            avatar={avatar}
          />
          <NotificationDropdownMenu notifications={notifications} />
        </div>
      ) : (
        <div className="top container sticky flex w-full items-center justify-end rounded-lg px-6 py-6 transition-all">
          <Button
            onClick={handleSignIn}
            className="bg-slate-300 text-slate-900 hover:bg-slate-400"
          >
            Sign in
          </Button>
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
      )}
    </>
  );
}
