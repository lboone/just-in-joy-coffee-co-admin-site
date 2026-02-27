import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
};
const PageTableContainer = ({ children, className }: Props) => {
  return (
    <div className={cn("flex flex-col gap-4  mx-auto p-4", className)}>
      {children}
    </div>
  );
};
export default PageTableContainer;
