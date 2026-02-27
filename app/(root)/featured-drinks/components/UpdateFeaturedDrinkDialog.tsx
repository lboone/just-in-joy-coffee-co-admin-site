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
import FeaturedDrinkForm from "./FeaturedDrinkForm";

type Props = {
  featuredDrink: FeaturedDrink;
  onUpdate?: () => void;
};
const UpdateFeaturedDrinkDialog = ({ featuredDrink, onUpdate }: Props) => {
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
          <DialogTitle>Update Featured Drink</DialogTitle>
          <DialogDescription>
            Update the Featured Drink for your site.
          </DialogDescription>
        </DialogHeader>
        <FeaturedDrinkForm
          setOpen={(toOpen: boolean) => setOpen(toOpen)}
          featuredDrink={featuredDrink}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
export default UpdateFeaturedDrinkDialog;
