import { cookies } from "next/headers";
import { type ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "./_components/site-header";
import { api } from "~/trpc/server";

const StoreTwoDashboardLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  
  void api.employeeRoute.clocking.getOne.prefetch()

  if (!session || session?.user.role !== "STORETWO") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-2xl">
          Unauthenticated User, Please login before access this page
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AppSidebar session={session} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StoreTwoDashboardLayout;
