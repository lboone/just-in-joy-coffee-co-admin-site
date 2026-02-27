"use client";

import { ImageSelectField } from "@/components/layout/ImageSelectField";
import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createShoutOut,
  updateShoutOut,
} from "@/lib/actions/shout-out.actions";
import { imageURLRegEx } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  imgAlt: z.string().min(1, { message: "Image Alt is required" }),
  img: z.string().url({ message: "Must be a valid URL" }).regex(imageURLRegEx, {
    message: "Must be a valid Image URL",
  }),
  name: z.string().min(1, { message: "Name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  imgKey: z.string().min(1, { message: "Image Key is required" }),
});

type Props = {
  setOpen: (setOpen: boolean) => void;
  shoutOut?: ShoutOut;
  onUpdate?: () => Promise<void>;
};
const ShoutOutForm = ({ setOpen, shoutOut, onUpdate }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: shoutOut?.title || "",
      description: shoutOut?.description || "",
      img: shoutOut?.img || "",
      imgAlt: shoutOut?.imgAlt || "",
      name: shoutOut?.name || "",
      location: shoutOut?.location || "",
      imgKey: shoutOut?.imgKey || "",
    },
  });

  const setImageKey = (imgKey: string) => {
    imgKey = imgKey.replace(
      "https://maroon-quiet-crab-480.mypinata.cloud/ipfs/",
      ""
    );
    form.setValue("imgKey", imgKey);
  };
  useEffect(() => {
    if (shoutOut) {
      form.reset({
        title: shoutOut.title,
        description: shoutOut.description,
        img: shoutOut.img,
        imgAlt: shoutOut.imgAlt,
        name: shoutOut.name,
        location: shoutOut.location,
        imgKey: shoutOut.imgKey,
      });
    }
  }, [shoutOut, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    try {
      const res = shoutOut
        ? await updateShoutOut(shoutOut._id, values)
        : await createShoutOut(values);
      if (res.success) {
        toast.success(
          `Shout Out ${shoutOut ? "updated" : "created"} successfully!`
        );
        form.reset();
        if (onUpdate) {
          await onUpdate();
        } else {
          router.refresh();
        }
        setError("");
        setOpen(false);
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch (err) {
      console.error(
        `Error ${shoutOut ? "updating" : "creating"} shout out`,
        err
      );
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred. Please try again later.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormDescription>
          {error && <span className="text-red-500">{error}</span>}
        </FormDescription>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Shout Out Title" {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Shout Out Description" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.description?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name of person giving shout out"
                  {...field}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Location of event from shout out"
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.location?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imgAlt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Alt</FormLabel>
              <FormControl>
                <Input
                  placeholder="Image Alt (e.g. Shout Out Image)"
                  {...field}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.imgAlt?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <ImageSelectField
              field={field}
              formLabel="Image URL"
              setImgKey={setImageKey}
            />
          )}
        />
        <FormField
          control={form.control}
          name="imgKey"
          render={({ field }) => (
            <Input placeholder="Image Key" {...field} type="hidden" />
          )}
        />

        <div className="flex justify-end gap-4">
          <Button variant="default" disabled={loading} type="submit">
            {shoutOut ? "Update" : "Submit"}
            <Spinner show={loading} />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ShoutOutForm;
