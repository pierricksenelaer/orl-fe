import { UserSignUpForm } from "@/components/user-signup-form";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Image from "next/image";
import React from "react";
import NetraScaleLogo from "@/components/images/logo-white-whiteText.png";
import NetraLabsLogo from "@/components/images/BrandImage.png";

export default async function Page() {
  const session = await getServerSession(authOptions);
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
      {/* <div className="absolute left-6 top-6">
        <Image
          src={NetraScaleLogo}
          className="mx-auto"
          width={150}
          height={150}
          alt="logo"
        />
      </div> */}
      <div className="absolute left-6 top-6 flex items-center gap-3">
        <Image
          src={NetraLabsLogo}
          className="mx-auto"
          width={60}
          height={60}
          alt="logo"
        />
        <h1 className="text-3xl font-bold">OpenRiskLab</h1>
      </div>
      <div className="lg:p-8">
        <div className="absolute left-2/4 top-2/4 z-50 w-full max-w-[26rem] -translate-x-2/4 -translate-y-2/4 sm:w-[600px]">
        { session && (
          <UserSignUpForm />
        )}
          
        </div>
      </div>
    </>
  );
}
