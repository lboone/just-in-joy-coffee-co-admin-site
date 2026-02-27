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
import EventForm from "./EventForm";

type Props = {
  event: Event;
};
const UpdateEventDialog = ({ event }: Props) => {
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
          <DialogTitle>Update Event</DialogTitle>
          <DialogDescription>Update the Event for your site.</DialogDescription>
        </DialogHeader>
        <EventForm
          setOpen={(toOpen: boolean) => setOpen(toOpen)}
          event={event}
        />
      </DialogContent>
    </Dialog>
  );
};
export default UpdateEventDialog;
