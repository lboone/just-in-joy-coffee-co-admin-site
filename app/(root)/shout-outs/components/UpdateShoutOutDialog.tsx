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
import ShoutOutForm from "./ShoutOutForm";

type Props = {
  shoutOut: ShoutOut;
  onUpdate?: () => Promise<void>;
};
const UpdateShoutOutDialog = ({ shoutOut, onUpdate }: Props) => {
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
          <DialogTitle>Update Shout Out</DialogTitle>
          <DialogDescription>
            Update the Shout Out for your site.
          </DialogDescription>
        </DialogHeader>
        <ShoutOutForm
          setOpen={(toOpen: boolean) => setOpen(toOpen)}
          shoutOut={shoutOut}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
export default UpdateShoutOutDialog;
