"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import Image from "next/image";

type HoverImageProps = {
  text: string; // Text to display
  imageUrl: string; // URL of the image to show
  cardTitle?: string;
};

const HoverImage = ({ text, imageUrl, cardTitle }: HoverImageProps) => {
  // If cardTitle is provided, use it; otherwise, use the text
  cardTitle = cardTitle || text;
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer hover:underline underline-offset-4">
        {text}
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-0" align="start">
        <Card>
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={imageUrl}
              alt={text}
              className="w-full h-auto rounded object-cover"
              width={400}
              height={400}
              priority
            />
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverImage;
