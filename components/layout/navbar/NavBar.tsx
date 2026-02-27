import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import NavbarAvatar from "./NavbarAvatar";
import { NavbarModeToggle } from "./NavbarModeToggle";

function NavBar() {
  return (
    <nav className="p-4 flex items-center justify-between">
      {/* LEFT */}
      <SidebarTrigger className="cursor-pointer" />
      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link href="/">Dashboard</Link>
        <NavbarModeToggle />
        <NavbarAvatar />
      </div>
    </nav>
  );
}
export default NavBar;
