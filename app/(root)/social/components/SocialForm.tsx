"use client";

import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSocial, updateSocial } from "@/lib/actions/social.actions";
import { instagramReelRegex } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  permalink: z
    .string()
    .url({ message: "Must be a valid URL" })
    .regex(instagramReelRegex, {
      message: "Must be a valid Instagram Reel URL",
    }),
});

type Props = {
  setOpen: (setOpen: boolean) => void;
  social?: Social;
  onUpdate?: () => void;
};
const SocialForm = ({ setOpen, social, onUpdate }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permalink: social?.permalink || "",
    },
  });

  useEffect(() => {
    if (social) {
      form.reset({
        permalink: social.permalink,
      });
    }
  }, [social, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    try {
      const res = social
        ? await updateSocial(social._id, values)
        : await createSocial(values);
      if (res.success) {
        toast.success(`Social ${social ? "updated" : "created"} successfully!`);
        form.reset();
        if (onUpdate) {
          onUpdate();
        }
        router.refresh();
        setError("");
        setOpen(false);
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch (err) {
      console.error(`Error ${social ? "updating" : "creating"} social`, err);
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred. Please try again later.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="permalink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram Reel URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.instagram.com/reel/your-reel-id"
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.permalink?.message}
                {error && <span className="text-red-500">{error}</span>}
              </FormMessage>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button variant="default" disabled={loading} type="submit">
            {social ? "Update" : "Submit"}
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
export default SocialForm;
