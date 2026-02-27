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
import FeaturedDrinkForm from "./FeaturedDrinkForm";

const CreateFeaturedDrinkDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Featured Drink <PlusCircleIcon className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Featured Drink</DialogTitle>
          <DialogDescription>
            Add a new Featured Drink to your site.
          </DialogDescription>
        </DialogHeader>
        <FeaturedDrinkForm setOpen={(toOpen: boolean) => setOpen(toOpen)} />
      </DialogContent>
    </Dialog>
  );
};
export default CreateFeaturedDrinkDialog;
