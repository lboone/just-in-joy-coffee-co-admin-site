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
import SocialForm from "./SocialForm";

type Props = {
  social: Social;
  onUpdate: () => void;
};
const UpdateSocialDialog = ({ social, onUpdate }: Props) => {
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
          <DialogTitle>Update Social</DialogTitle>
          <DialogDescription>
            Update the Instagram Reel URL for your site.
          </DialogDescription>
        </DialogHeader>
        <SocialForm
          setOpen={(toOpen: boolean) => setOpen(toOpen)}
          social={social}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
export default UpdateSocialDialog;
