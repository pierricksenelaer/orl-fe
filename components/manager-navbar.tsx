"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import BrandImg from "@/components/images/BrandImage.png";
import { useRouter } from "next/navigation";

export default function ManagerNavbar() {
  const router = useRouter();

  const handleClick = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
      <div className="top sticky flex w-full items-center justify-between rounded-lg px-6 py-6 transition-all ">
        <div></div>
        <div className="flex items-center ">
          <Link href="/manager" className="flex items-center gap-4 px-8">
            <Image src={BrandImg} className="mx-auto h-12 w-12" alt="img" />
            <p className="text-4xl font-bold">OpenRiskLab</p>
          </Link>
        </div>
        <Button
          className="bg-slate-200 text-slate-950 hover:bg-slate-300"
          onClick={handleClick}
        >
          Sign out
        </Button>
      </div>
  );
}
