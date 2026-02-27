"use client";
import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFeaturedDrink } from "@/lib/actions/featured-drinks.actions";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  featuredDrinkId: string;
  requiredPhrase: string;
  onDelete?: () => void;
};

const DeleteFeaturedDrinkButton = ({
  featuredDrinkId,
  requiredPhrase,
  onDelete,
}: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  requiredPhrase = requiredPhrase.toUpperCase();

  const handleDelete = () => {
    if (confirmationPhrase !== requiredPhrase) {
      toast.error(`Please type "${requiredPhrase}" to confirm deletion.`);
      return;
    }

    setLoading(true);
    deleteFeaturedDrink(featuredDrinkId)
      .then((res) => {
        if (res.success) {
          toast.success("Featured drink deleted successfully!");
          if (onDelete) {
            onDelete();
          }
          router.refresh();
          setOpen(false);
        } else {
          toast.error(res.message);
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error deleting featured drink:", error);
        toast.error("An error occurred while deleting the featured drink.");
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          <Trash2Icon className="text-rose-900 dark:text-rose-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            Featured Drink from the server and off of your site.
          </DialogDescription>
          <div className="mt-4">
            <label
              htmlFor="confirmationPhrase"
              className="block text-sm font-medium"
            >
              Type &quot;{requiredPhrase}&quot; to confirm deletion:
            </label>
            <input
              id="confirmationPhrase"
              type="text"
              value={confirmationPhrase}
              onChange={(e) => setConfirmationPhrase(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder={requiredPhrase}
            />
          </div>
          <Button
            variant="destructive"
            disabled={loading || confirmationPhrase !== requiredPhrase}
            onClick={() => handleDelete()}
            className="mt-4"
          >
            Delete
            <Spinner show={loading} />
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteFeaturedDrinkButton;
