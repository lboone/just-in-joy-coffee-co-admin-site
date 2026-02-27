import {
  CalendarIcon,
  HomeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  MessageCircleIcon,
  ShareIcon,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Home Swiper",
    href: "/home-swiper",
    icon: HomeIcon,
  },
  {
    title: "Events",
    href: "/events",
    icon: CalendarIcon,
  },
  {
    title: "Featured Drinks",
    href: "/featured-drinks",
    icon: MapPinIcon,
  },
  {
    title: "Shout Outs",
    href: "/shout-outs",
    icon: MessageCircleIcon,
  },
  {
    title: "Social",
    href: "/social",
    icon: ShareIcon,
  },
  {
    title: "Gallery",
    href: "/gallery",
    icon: ImageIcon,
  },
];
