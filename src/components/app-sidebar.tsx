"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconReport,
  IconSettings,
  IconFileNeutral,
  IconBuildingStore,
  IconUsersGroup,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  user: {
    name: "Marketing Systems",
    email: "superadmin@gmail.com",
    avatar: "/icon-marketing.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/superadmin",
      icon: IconDashboard,
    },
    {
      title: "Manajemen Programmer",
      url: "/programmer-management",
      icon: IconUsersGroup,
    },
    {
      title: "Manajemen Product IT",
      url: "/product-management",
      icon: IconFileNeutral,
    },
    {
      title: "Manajemen Marketing",
      url: "/marketing-management",
      icon: IconBuildingStore,
      children: [
        {
          title: "Data Marketing",
          url: "/marketing-management/data-marketing",
        },
        {
          title: "Transaksi Product",
          url: "/marketing-management/transaksi-product",
        },
        {
          title: "Transaksi Jasa",
          url: "/marketing-management/transaksi-jasa",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    {
      title: "Master",
      url: "/master",
      icon: IconDatabase,
      children: [
        {
          title: "Skills Category",
          url: "/skills-category",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/setting",
      icon: IconSettings,
    },
  ],
  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image src="/icon-marketing.png" alt="Marketing Systems" width={32} height={32} />
                <span className="text-base font-semibold">Marketing Systems</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
