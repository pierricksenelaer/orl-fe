import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import NetraLabsLogo from "@/components/images/BrandImage.png";

export function LandingPageNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2 ">
        <Image
          src={NetraLabsLogo}
          className="mx-auto"
          width={30}
          height={30}
          alt="logo"
        />
        <span className="inline-block text-xl font-bold">OpenRiskLab</span>
      </Link>
    </div>
  );
}
