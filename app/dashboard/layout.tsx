import { Sidebar } from "@/components/sidebar";
import DashboardNavbar from "@/components/dashboard-navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Powered by Netra Labs - Ben Cao",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen flex-row justify-start">
        <Sidebar />
        <section className="container w-full overflow-auto">
          <DashboardNavbar />
          {children}
        </section>
      </div>
    </>
  );
}

//todo add sidebar collapse interaction with section. When sidebar is collapsed, section should margin to left.
