"use client";

import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { fetchLatLng } from "@/lib/server-actions";
import {
  formatDate,
  formatDateAsDate,
  formatMilitaryTime,
  getDefaultTimesRoundedToHour,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .transform((val) => Number(val)),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .transform((val) => Number(val)),
  date: z.date().min(new Date(), "Date is required"),
  starttime: z.string().min(1, "Start time is required"),
  endtime: z.string().min(1, "End time is required"),
});

type Props = {
  setOpen: (setOpen: boolean) => void;
  event?: Event;
};

const EventForm = ({ setOpen, event }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const handleAddressChange = () => {
    clearTimeout(timeoutRef.current as NodeJS.Timeout);
    timeoutRef.current = setTimeout(async () => {
      setAddressLoading(true);
      setError("");
      try {
        const addr = form.getValues("address");
        const city = form.getValues("city");
        const state = form.getValues("state");
        const zip = form.getValues("zip");
        if (!addr || !city || !state || !zip) {
          setAddressLoading(false);
          return;
        }
        // Combine address components into a single string
        const fullAddress = `${addr}, ${city}, ${state} ${zip}`;
        // Fetch latitude and longitude based on the full address
        if (!fullAddress) {
          setError("Please provide a valid address.");
          setAddressLoading(false);
          return;
        }
        const res = await fetchLatLng(fullAddress);
        if (!res.success) {
          setError(res.message);
          setAddressLoading(false);
          return;
        }
        if (!res.data || !res.data.lat || !res.data.lng) {
          setError("No coordinates found for the provided address.");
          setAddressLoading(false);
          return;
        }
        const { lat, lng } = res.data;
        form.setValue("latitude", lat, { shouldValidate: true });
        form.setValue("longitude", lng, { shouldValidate: true });
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching the address coordinates.");
        toast.error(
          "An error occurred while fetching the address coordinates."
        );
        setAddressLoading(false);
      } finally {
        setAddressLoading(false);
      }
    }, 800);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: event ? event.name : "",
      address: event ? event.address : "",
      city: event ? event.city : "",
      state: event ? event.state : "NC",
      zip: event ? event.zip : "",
      country: event ? event.country : "USA",
      latitude: event ? event.latitude : 0.0,
      longitude: event ? event.longitude : 0.0,
      date: event ? formatDateAsDate(event.date) : new Date(),
      starttime: event
        ? formatMilitaryTime(event.starttime)
        : getDefaultTimesRoundedToHour().starttime,
      endtime: event
        ? formatMilitaryTime(event.endtime)
        : getDefaultTimesRoundedToHour().endtime,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    try {
      const res = event
        ? await updateEvent(event._id, values)
        : await createEvent(values);
      if (res.success) {
        toast.success(`Event ${event ? "updated" : "created"} successfully!`);
        form.reset();
        router.refresh();
        setError("");
        setOpen(false);
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch (err) {
      console.error(`Error ${event ? "updating" : "creating"} event`, err);
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred. Please try again later.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormDescription>
          {error && <div className="text-red-500">{error}</div>}
        </FormDescription>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Event Name" {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="address"
                  {...field}
                  onBlur={async () => {
                    field.onBlur();
                    await handleAddressChange();
                  }}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.address?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <div className="flex align-center gap-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-2">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rolesville"
                    {...field}
                    onBlur={async () => {
                      field.onBlur();
                      await handleAddressChange();
                    }}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.city?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex-1 max-w-[50px]">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    placeholder="NC"
                    {...field}
                    onBlur={async () => {
                      field.onBlur();
                      await handleAddressChange();
                    }}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.state?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem className="flex-1 max-w-[80px]">
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="27601"
                    {...field}
                    onBlur={async () => {
                      field.onBlur();
                      await handleAddressChange();
                    }}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.zip?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex-1 max-w-[50px]">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="USA" {...field} readOnly />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.country?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="flex align-center gap-4 w-full">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  {addressLoading ? (
                    <Spinner show={addressLoading} />
                  ) : (
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage>
                  {form.formState.errors.latitude?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  {addressLoading ? (
                    <Spinner show={addressLoading} />
                  ) : (
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage>
                  {form.formState.errors.longitude?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 w-full">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="date-picker">Date</FormLabel>
                <Popover
                  open={openPopover}
                  onOpenChange={() => {
                    setOpenPopover(!openPopover);
                  }}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-32 justify-between font-normal"
                        type="button"
                      >
                        {field.value ? formatDate(field.value) : "Select date"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date); // ✅ actually call the function
                        setOpenPopover(false);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage>{form.formState.errors.date?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="starttime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.starttime?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endtime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.endtime?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="default" disabled={loading} type="submit">
            {event ? "Update" : "Submit"}
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
export default EventForm;
