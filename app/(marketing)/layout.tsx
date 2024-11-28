import { LandingPageNav } from "@/components/landing-page-nav";

import CognitoButton from "@/components/button-cognito";

import Image from "next/image";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
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
          rotate: "180deg"
        }}
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/100 opacity-50" />
      <header className="bg-background container z-40">
        <div className="flex h-20 items-center justify-between py-6">
          <LandingPageNav />
          <nav>
            <CognitoButton />
          </nav>
        </div>
      </header>
      <main className="z-50 flex-1 flex flex-grow px-4">{children}</main>
    </div>
  );
}
