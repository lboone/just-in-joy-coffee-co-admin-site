"use client";
import PageContainer from "@/components/layout/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardCounts } from "@/lib/actions/general.actions";
import {
  CalendarIcon,
  HomeIcon,
  ImageIcon,
  MapPinIcon,
  MessageCircleIcon,
  ShareIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const dashboardCards: DashboardCardData[] = [
  {
    title: "Shout Outs",
    subTitle: "0 document(s) found",
    body: "What the people are saying about you. Add, edit, and delete shout-outs.",
    dataKey: "shoutOutsCount",
    icon: MessageCircleIcon,
  },
  {
    title: "Featured Drinks",
    subTitle: "0 document(s) found",
    body: "Featured drinks on the home page. Add, edit, and delete featured drinks.",
    dataKey: "featuredDrinksCount",
    icon: MapPinIcon,
  },
  {
    title: "Events",
    subTitle: "0 document(s) found",
    body: "Upcoming events. Add, edit, and delete events.",
    dataKey: "eventsCount",
    icon: CalendarIcon,
  },
  {
    title: "Galleries",
    subTitle: "0 document(s) found",
    body: "Featured galleries on the home page. Add, edit, and delete galleries.",
    dataKey: "galleriesCount",
    icon: ImageIcon,
  },
  {
    title: "Home Swipers",
    subTitle: "0 document(s) found",
    body: "Home swipers on the home page. Add, edit, and delete home swipers.",
    dataKey: "homeSwiperCount",
    icon: HomeIcon,
  },
  {
    title: "Socials",
    subTitle: "0 document(s) found",
    body: "Instagram posts on the home page. Add, edit, and delete socials.",
    dataKey: "socialsCount",
    icon: ShareIcon,
  },
];
export default function Home() {
  const [dashboardCardsData, setDashboardCardsData] =
    useState<DashboardCountsData>({
      featuredDrinksCount: 0,
      shoutOutsCount: 0,
      eventsCount: 0,
      galleriesCount: 0,
      homeSwiperCount: 0,
      socialsCount: 0,
    });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dashboardCounts()
      .then((res) => {
        if (res && res.data) {
          setDashboardCardsData(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error:", err);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <DashboardCardSkeleton key={card.title} />
        ))}
      </div>
    );
  }
  return (
    <PageContainer title="Dashboard Page">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            subtitle={`${dashboardCardsData[card.dataKey]} document(s) found`}
            body={card.body}
            icon={card.icon}
          />
        ))}
      </div>
    </PageContainer>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
const DashboardCard = ({ title, subtitle, body, icon }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-center">
          <div className="flex-1">
            <CardTitle className="text-3xl text-gray-600">{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <div className="flex-1 flex justify-center items-center">
            {React.createElement(icon, {
              className: "h-20 w-20 text-gray-600",
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>{body}</div>
      </CardContent>
    </Card>
  );
};

const DashboardCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-[250px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-[200px]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </CardContent>
    </Card>
  );
};
