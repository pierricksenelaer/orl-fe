"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Notification, User } from "@/lib/types";
import { Bell, Clock7 } from "lucide-react";
import { Separator } from "./ui/separator";
import { timeAgo } from "@/helpers/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Icons } from "./ui/ui-icons";
import { useToast } from "./ui/use-toast";

type NotificationDropdownMenuProps = {
  notifications: Notification[];
};

export default function NotificationDropdownMenu({
  notifications,
}: NotificationDropdownMenuProps) {
  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectInvitations, setProjectInvitations] = useState<Notification[]>(
    [],
  );
  const { toast } = useToast();
  const [dialogContent, setDialogContent] = useState<any>({
    senderName: "",
    hackathonName: "",
    projectName: "",
    invitationId: "",
  });

  const onClickNotificationTab = (invitation: Notification) => {
    const arr = projectInvitations.map((notification) => {
      if (notification.id === invitation.id) {
        return {
          ...notification,
          isViewed: true,
        };
      }
      return notification;
    });
    setProjectInvitations(arr);
    const content = {
      senderName: invitation.sender.name,
      hackathonName: invitation.hackathon?.name,
      projectName: invitation.contentName,
      invitationId: invitation.id,
    };
    setDialogContent(content);
    setOpenInvitationDialog(true);
  };

  const onClickIgnoreInvitation = async () => {
    try {
      await fetch("/api/users/notifications/", {
        method: "PUT",
        body: JSON.stringify({
          notificationId: dialogContent.invitationId,
          action: "ignore",
        }),
      });
    } catch (error) {
      console.log(error);
    }
    setOpenInvitationDialog(false);
  };

  const onClickAcceptInvitation = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users/notifications/", {
        method: "PUT",
        body: JSON.stringify({
          notificationId: dialogContent.invitationId,
          action: "accept",
        }),
      });
      if (res.ok) {
        toast({
          title: "Success!",
          description:
            'You have joined the project. You can now view the project under the "Projects" tab. Have fun with your team! 😊',
        });
        setIsSubmitting(false);
      } else {
        toast({
          variant: "destructive",
          title: "Failed 😓",
          description: res.statusText,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenInvitationDialog(false);
  };

  const filteringNotifications = useCallback(() => {
    return notifications.filter((notification) => {
      return notification.category === "project invitation";
    });
  }, [notifications]);

  useEffect(() => {
    const arr = filteringNotifications();
    setProjectInvitations(arr);
  }, [notifications, filteringNotifications]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            {projectInvitations.length !== 0 &&
              projectInvitations.find(
                (invitation) => invitation.isViewed === false,
              ) && (
                <span className="relative flex h-2 w-2  translate-x-9 translate-y-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
              )}
            <Bell className="ml-4 h-6 w-6 cursor-pointer text-slate-200 hover:scale-110 hover:text-slate-500" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 w-[300px]" align="end" forceMount>
          <DropdownMenuGroup>
            {projectInvitations.length !== 0 ? (
              projectInvitations.map((invitation) => {
                return (
                  <div key={invitation.id}>
                    <DropdownMenuItem
                      onClick={() => onClickNotificationTab(invitation)}
                      className="flex cursor-pointer items-center rounded-md focus:bg-slate-600 focus:text-white"
                    >
                      <Avatar className="mr-3 h-11 w-11">
                        <AvatarImage
                          src={invitation.sender.userPreference.avatar}
                          alt={invitation.sender.name}
                        />
                        <AvatarFallback className="bg-slate-800 text-2xl font-bold text-slate-100">
                          {invitation.sender.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-center">
                        <p>
                          <span className="font-bold">
                            {invitation?.sender?.name}
                          </span>
                          <span> sent you an invitation</span>
                        </p>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <Clock7 className="h-4 w-4" />
                          {timeAgo(invitation.createdAt)}
                          {!invitation.isViewed && (
                            <span className="h-2 w-2 rounded-full bg-red-400"></span>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                );
              })
            ) : (
              <DropdownMenuLabel className="font-medium text-slate-500">
                No messages yet
              </DropdownMenuLabel>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={openInvitationDialog}
        onOpenChange={setOpenInvitationDialog}
      >
        <DialogContent className="w-[600px]">
          <DialogHeader className="text-slate-900">
            <DialogTitle className="text-center text-xl font-bold">
              Project invitation
            </DialogTitle>
          </DialogHeader>
          <div className="text-slate-900">
            <p className="text-lg font-medium">
              You are invited by{" "}
              <span className="font-bold text-emerald-600">
                {dialogContent?.senderName}
              </span>{" "}
              to join:
            </p>
            <div className="grid w-full grid-cols-3 gap-2 ">
              <div className="mt-2 text-lg font-medium">
                <p>Hackathon:</p>
                <p>Project:</p>
              </div>
              <div className="col-span-2 mt-2 text-lg font-bold">
                <p>{dialogContent.hackathonName}</p>
                <p>{dialogContent.projectName}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 flex gap-6">
            <Button onClick={onClickIgnoreInvitation} variant={"destructive"}>
              Ignore
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={onClickAcceptInvitation}
              className="bg-green-700"
            >
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
