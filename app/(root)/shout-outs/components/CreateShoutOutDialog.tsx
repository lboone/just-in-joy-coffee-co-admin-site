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
import ShoutOutForm from "./ShoutOutForm";

const CreateShoutOutDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Shout Out <PlusCircleIcon className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Shout Out</DialogTitle>
          <DialogDescription>
            Add a new Shout Out to your site.
          </DialogDescription>
        </DialogHeader>
        <ShoutOutForm setOpen={(toOpen: boolean) => setOpen(toOpen)} />
      </DialogContent>
    </Dialog>
  );
};
export default CreateShoutOutDialog;
