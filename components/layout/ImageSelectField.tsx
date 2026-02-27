import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { shoutOutImages } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import { ControllerRenderProps } from "react-hook-form";

type Props = {
  field: ControllerRenderProps<{
    title: string;
    description: string;
    img: string;
    imgAlt: string;
    name: string;
    location: string;
    imgKey: string;
  }>;
  formLabel: string;
  setImgKey?: (imgKey: string) => void;
};
export function ImageSelectField({ field, formLabel, setImgKey }: Props) {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{formLabel}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {field.value
                ? shoutOutImages.find((img) => img.value === field.value)?.label
                : "Select an image..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandEmpty>No image found.</CommandEmpty>
            <CommandGroup>
              {shoutOutImages.map((img) => (
                <CommandItem
                  key={img.value}
                  value={img.value}
                  onSelect={() => {
                    field.onChange(img.value);
                    setImgKey?.(img.value);
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.label}
                    width={40}
                    height={40}
                    className="mr-2 rounded"
                  />
                  {img.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      field.value === img.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
