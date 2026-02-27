"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/auth.actions";
import { ExternalLinkIcon, LogOutIcon } from "lucide-react";

interface NavbarAvatarProps {
  showMenu?: boolean;
}

function NavbarAvatar({ showMenu = true }: NavbarAvatarProps) {
  const handleClick = async () => {
    await logout();
  };
  const handleNavigation = () => {
    window.location.href = "/";
  };
  if (!showMenu) {
    return (
      <Avatar className="cursor-pointer h-5 w-5">
        <AvatarImage src="https://avatars.githubusercontent.com/u/1486366" />
        <AvatarFallback>LB</AvatarFallback>
      </Avatar>
    );
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://avatars.githubusercontent.com/u/1486366" />
            <AvatarFallback>LB</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={10}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleNavigation()}>
            <ExternalLinkIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
            Return Home
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => handleClick()}>
            <LogOutIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
export default NavbarAvatar;
