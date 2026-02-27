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
  createHomeSwiper,
  updateHomeSwiper,
} from "@/lib/actions/home-swiper.actions";
import { imageBaseURL, imageURLRegEx } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  src: z.string().url({ message: "Must be a valid URL" }).regex(imageURLRegEx, {
    message: "Must be a valid Image URL",
  }),
  alt: z.string().min(1, { message: "Name is required" }),
  width: z
    .number()
    .min(1, { message: "Width must be at least 1" })
    .max(1000, { message: "Width must be at most 1000" })
    .transform((val) => Number(val)),
  height: z
    .number()
    .min(1, { message: "Height must be at least 1" })
    .max(1000, { message: "Height must be at most 1000" })
    .transform((val) => Number(val)),
  imgKey: z.string().min(1, { message: "Image Key is required" }),
});

type Props = {
  setOpen: (setOpen: boolean) => void;
  homeSwiper?: HomeSwiper;
  onUpdate?: () => void; // Optional callback for update
};
const HomeSwiperForm = ({ setOpen, homeSwiper, onUpdate }: Props) => {
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
    mode: "onChange",
    defaultValues: {
      src: homeSwiper?.src || "",
      alt: homeSwiper?.alt || "",
      width: homeSwiper?.width || 400,
      height: homeSwiper?.height || 335,
      imgKey: homeSwiper?.imgKey || "",
    },
  });

  useEffect(() => {
    if (homeSwiper) {
      form.reset({
        src: homeSwiper.src,
        alt: homeSwiper.alt,
        width: homeSwiper.width,
        height: homeSwiper.height,
        imgKey: homeSwiper.imgKey,
      });
      if (homeSwiper.imgKey) {
        setCid(homeSwiper.imgKey);
      }
    }
  }, [homeSwiper, form]);

  useEffect(() => {
    if (cid) {
      const imgUrl = `${imageBaseURL}${cid}`;
      form.setValue("imgKey", cid); // Update imgKey field
      form.setValue("src", imgUrl); // Update img field
    }
  }, [cid, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    try {
      const res = homeSwiper
        ? await updateHomeSwiper(homeSwiper._id, values)
        : await createHomeSwiper(values);
      if (res.success) {
        toast.success(
          `Home Swiper ${homeSwiper ? "updated" : "created"} successfully!`
        );
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
        `Error ${homeSwiper ? "updating" : "creating"} home swiper`,
        err
      );
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred. Please try again later.");
      setLoading(false);
    } finally {
      if (onUpdate) {
        onUpdate();
      }
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormDescription>
          {error && <span className="text-red-500">{error}</span>}
        </FormDescription>
        <FormField
          control={form.control}
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Name</FormLabel>
              <FormControl>
                <Input placeholder="Image Name" {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.alt?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="src"
          render={({ field }) => (
            <Input
              placeholder="https://maroon-quiet-crab-480.mypinata.cloud/ipfs/your-image-key"
              type="hidden"
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

        <div className="flex gap-2 w-full">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Image Width</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Image Width"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(isNaN(val) ? 0 : val);
                    }}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.width?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Image Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Image Height"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(isNaN(val) ? 0 : val);
                    }}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.height?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        {!form || form.getValues("imgKey") === "" || cid === null || "" ? (
          <Dropzone setCid={setCid} handleRefresh={handleRefresh} />
        ) : (
          <ImageDisplay
            imgUrl={form.getValues("src")}
            imgKey={form.getValues("imgKey")}
          />
        )}
        <div className="flex justify-end gap-4">
          <Button variant="default" disabled={loading} type="submit">
            {homeSwiper ? "Update" : "Submit"}
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
export default HomeSwiperForm;
