"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import HomeSwiperForm from "./HomeSwiperForm";

type Props = {
  homeSwiper: HomeSwiper;
  onUpdate?: () => void;
};
const UpdateHomeSwiperDialog = ({ homeSwiper, onUpdate }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="text-blue-900 dark:text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Home Swiper</DialogTitle>
          <DialogDescription>
            Update the Home Swiper for your site.
          </DialogDescription>
        </DialogHeader>
        <HomeSwiperForm
          setOpen={(toOpen: boolean) => setOpen(toOpen)}
          homeSwiper={homeSwiper}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
export default UpdateHomeSwiperDialog;
