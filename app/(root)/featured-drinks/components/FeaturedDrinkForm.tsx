"use client";

import Dropzone from "@/components/layout/Dropzone";
import ImageDisplay from "@/components/layout/ImageDisplay";
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
import {
  createFeaturedDrink,
  updateFeaturedDrink,
} from "@/lib/actions/featured-drinks.actions";
import { imageBaseURL, imageURLRegEx } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  alt: z.string().min(1, { message: "Image Alt is required" }),
  img: z.string().url({ message: "Must be a valid URL" }).regex(imageURLRegEx, {
    message: "Must be a valid Image URL",
  }),
  orderUrl: z.string().url({
    message: "Must be a valid Order URL",
  }),
  imgKey: z.string().min(1, { message: "Image Key is required" }),
});

type Props = {
  setOpen: (setOpen: boolean) => void;
  featuredDrink?: FeaturedDrink;
  onUpdate?: () => void;
};
const FeaturedDrinkForm = ({ setOpen, featuredDrink, onUpdate }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cid, setCid] = useState<string | null>(null); // State to manage CID
  const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    console.log("Refresh key updated:", refreshKey);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      img: featuredDrink?.img || "",
      alt: featuredDrink?.alt || "",
      title: featuredDrink?.title || "",
      subtitle: featuredDrink?.subtitle || "",
      orderUrl:
        featuredDrink?.orderUrl || "https://just-in-joy-coffee-co.square.site/",
      imgKey: featuredDrink?.imgKey || "",
    },
  });

  useEffect(() => {
    if (featuredDrink) {
      form.reset({
        img: featuredDrink.img,
        alt: featuredDrink.alt,
        title: featuredDrink.title,
        subtitle: featuredDrink.subtitle,
        orderUrl: featuredDrink.orderUrl,
        imgKey: featuredDrink.imgKey,
      });
      if (featuredDrink.imgKey) {
        setCid(featuredDrink.imgKey);
      }
    }
  }, [featuredDrink, form]);

  useEffect(() => {
    if (cid) {
      const imgUrl = `${imageBaseURL}${cid}`;
      form.setValue("imgKey", cid); // Update imgKey field
      form.setValue("img", imgUrl); // Update img field
    }
  }, [cid, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    try {
      const res = featuredDrink
        ? await updateFeaturedDrink(featuredDrink._id, values)
        : await createFeaturedDrink(values);
      if (res.success) {
        toast.success(
          `Featured Drink ${
            featuredDrink ? "updated" : "created"
          } successfully!`
        );
        if (onUpdate) {
          onUpdate();
        }
        form.reset();
        router.refresh();
        setError("");
        setOpen(false);
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch (err) {
      console.error(
        `Error ${featuredDrink ? "updating" : "creating"} featured drink`,
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
                <Input placeholder="Drink Type (e.g. Latte)" {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Drink Name (e.g. Pistachio)" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.subtitle?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="orderUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order URL</FormLabel>
              <FormControl>
                <Input placeholder="Order Now Link" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.orderUrl?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Alt</FormLabel>
              <FormControl>
                <Input
                  placeholder="Image Alt (e.g. Pistachio Latte)"
                  {...field}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.alt?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <Input
              type="hidden"
              placeholder="https://maroon-quiet-crab-480.mypinata.cloud/ipfs/your-image-key"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="imgKey"
          render={({ field }) => (
            <Input type="hidden" placeholder="Image Key" {...field} />
          )}
        />
        {!form || form.getValues("imgKey") === "" || cid === null || "" ? (
          <Dropzone setCid={setCid} handleRefresh={handleRefresh} />
        ) : (
          <ImageDisplay
            imgUrl={form.getValues("img")}
            imgKey={form.getValues("imgKey")}
          />
        )}

        <div className="flex justify-end gap-4">
          <Button variant="default" disabled={loading} type="submit">
            {featuredDrink ? "Update" : "Submit"}
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
export default FeaturedDrinkForm;
