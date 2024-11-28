import React, { useEffect, useState } from "react";
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
import { User } from "@/lib/types";

type UserDropdownMenuProps = {
  handleSignOut: () => void;
  user: User;
  goToUserProfile: () => void;
  avatar: string;
};

export default function UserDropdownMenu({
  handleSignOut,
  user,
  goToUserProfile,
  avatar,
}: UserDropdownMenuProps) {
  console.log(user)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-teal-200"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={user.name} />
            <AvatarFallback className="text-xl font-bold text-slate-950">
              {user.name ? user.name[0].toUpperCase() : 'C'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={goToUserProfile}
            className="cursor-pointer rounded-md focus:bg-slate-600 focus:text-white"
          >
            Edit Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer rounded-md focus:bg-slate-600 focus:text-white"
          onClick={handleSignOut}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
