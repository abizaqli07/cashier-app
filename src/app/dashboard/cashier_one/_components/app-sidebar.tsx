"use client";

import {
  IconBuildingStore,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconStopwatch
} from "@tabler/icons-react";

import type { Session } from "next-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/cashier_one",
      icon: IconDashboard,
    },
    {
      title: "Order",
      url: "/dashboard/cashier_one/order",
      icon: IconBuildingStore,
    },
    {
      title: "Transactions",
      url: "/dashboard/cashier_one/transaction",
      icon: IconChartBar,
    },
    {
      title: "Clocking",
      url: "/dashboard/cashier_one/clocking",
      icon: IconStopwatch,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ session }: { session: Session | null }) {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Cashier Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
