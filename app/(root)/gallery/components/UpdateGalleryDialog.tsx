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
import GalleryForm from "./GalleryForm";

type Props = {
  gallery: Gallery;
  onUpdate?: () => Promise<void>;
};
const UpdateGalleryDialog = ({ gallery, onUpdate }: Props) => {
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
          <DialogTitle>Update Gallery</DialogTitle>
          <DialogDescription>
            Update the Gallery for your site.
          </DialogDescription>
        </DialogHeader>
        <GalleryForm
          setOpen={(toOpen: boolean) => setOpen(toOpen)}
          gallery={gallery}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};
export default UpdateGalleryDialog;
