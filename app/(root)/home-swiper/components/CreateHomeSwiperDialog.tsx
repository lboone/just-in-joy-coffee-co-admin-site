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
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import HomeSwiperForm from "./HomeSwiperForm";

const CreateHomeSwiperDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Home Swiper <PlusCircleIcon className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Home Swiper</DialogTitle>
          <DialogDescription>
            Add a new Home Swiper to your site.
          </DialogDescription>
        </DialogHeader>
        <HomeSwiperForm setOpen={(toOpen: boolean) => setOpen(toOpen)} />
      </DialogContent>
    </Dialog>
  );
};
export default CreateHomeSwiperDialog;
