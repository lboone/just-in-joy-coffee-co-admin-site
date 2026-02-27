// components/Spinner.tsx
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export default function Spinner({
  show = true,
  className,
}: {
  show: boolean;
  className?: string;
}) {
  if (!show) return null;
  return (
    <div className="flex items-center justify-center p-4">
      <Loader
        className={cn(
          "h-6 w-6 ml-2 animate-spin text-muted-foreground",
          className
        )}
      />
    </div>
  );
}
