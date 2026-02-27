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
import SocialForm from "./SocialForm";

const CreateSocialDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Social <PlusCircleIcon className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Social</DialogTitle>
          <DialogDescription>
            Add a new Instagram Reel URL to your site.
          </DialogDescription>
        </DialogHeader>
        <SocialForm setOpen={(toOpen: boolean) => setOpen(toOpen)} />
      </DialogContent>
    </Dialog>
  );
};
export default CreateSocialDialog;
