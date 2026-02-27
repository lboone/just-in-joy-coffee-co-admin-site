"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/actions/auth.actions";
import { menuItems } from "@/lib/menu-items";
import { ChevronUpIcon, ExternalLinkIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NavbarAvatar from "../navbar/NavbarAvatar";

function AppSidebar() {
  const handleClick = async () => {
    await logout();
  };
  const handleNavigation = () => {
    window.location.href = "/";
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image
                  src="/admin-panel/JustInJoyCoffeeCoIcon.png"
                  alt="Just in Joy Coffee Co Logo"
                  width={30}
                  height={30}
                  priority
                  className="rounded-full"
                />
                <span className="text-lg font-bold">Just-In Joy Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menuItem) => (
                <SidebarMenuItem key={menuItem.title}>
                  <SidebarMenuButton asChild>
                    <Link href={menuItem.href}>
                      {<menuItem.icon />}
                      <span>{menuItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <NavbarAvatar showMenu={false} /> Lloyd Boone{" "}
                  <ChevronUpIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation()}>
                  <ExternalLinkIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Return Home
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleClick()}
                >
                  <LogOutIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;
