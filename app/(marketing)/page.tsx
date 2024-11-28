import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";


export default async function Home() {
  
  // const session = await getServerSession(authOptions);
  // if (session) {
  //   if (session?.user?.isAdmin) {
  //     redirect("/manager");
  //   } else {
  //     redirect("/dashboard/discussions");
  //     console.log('session.user')
  //   }
  // }

  return (
    <>
      <div className="max-md:flex max-md:flex-col max-md:gap-7 md:grid md:grid-cols-12 flex-grow md:px-10 md:pt-10 md:pb-5">
        
        <div className="col-span-12">
          <h1 className="text-[50px] md:text-[80px] font-bold">OpenRiskLab</h1>
          <div className="text-2xl border-t-[10px] border-white pt-4 w-2/3 [&+*]:mt-5">
              Your Cyber Risk Knowledge Hub
            </div>
        </div>
        
        <div className="col-span-12 md:col-span-7">
          <div>
            <Link
                href="/auth/signUp"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "text-lg font-semibold",
                )}
              >
                GET STARTED
            </Link>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5">
          <div className="col-span-5 text-4xl md:border-r flex-grow border-white md:px-4 md:text-right">
            Stay ahead of threats with the latest insights and best practices.
          </div>
        </div>
        
        <div className="col-span-12 grid md:grid-cols-12 gap-7">
            
          <div className="md:col-span-5 bg-gradient-to-br from-red-900 to-slate-900 bg-opacity-75 border border-gray-500 rounded-md min-h-52 p-4" style={{background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85))'}}>
            Panel #1
          </div>
          <div className="md:col-span-7 row-span-2 bg-gradient-to-br from-red-900 to-slate-900 border border-gray-500 rounded-md min-h-52 p-4" style={{background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65))'}}>
            Panel #2
          </div>
          <div className="md:col-span-5 bg-gradient-to-br from-red-900 to-slate-900 border border-gray-500 rounded-md min-h-52 p-4" style={{background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45))'}}>
            Panel #3
          </div>

        </div>

    </div>
    </>
  );
}
