import { UserAuthForm } from "@/components/user-auth-form";
import Image from "next/image";
import React from "react";
import NetraScaleLogo from "@/components/images/logo-white-whiteText.png";
import NetraLabsLogo from "@/components/images/BrandImage.png";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <Image
        src="/orl-splash.webp"
        alt="background page"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="absolute left-6 top-6">
      <Link href="/" className="flex items-center gap-3">
          <Image
            src={NetraLabsLogo}
            className="mx-auto"
            width={40}
            height={40}
            alt="logo"
          />
          <h1 className="text-xl font-bold">OpenRiskLab</h1>
        </Link>
      </div>
      {/* <div className="absolute right-6 top-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={NetraLabsLogo}
            className="mx-auto"
            width={40}
            height={40}
            alt="logo"
          />
          <h1 className="text-xl font-bold">NetraLabs</h1>
        </Link>
      </div> */}
      <div className="lg:p-8">
        <div className="absolute left-2/4 top-2/4 z-50 w-full max-w-[24rem] -translate-x-2/4 -translate-y-2/4 sm:w-[350px]">
          <UserAuthForm />
        </div>
      </div>
    </>
  );
}
