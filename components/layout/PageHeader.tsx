import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
};
const PageHeader = ({ children, className }: Props) => {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
};
export default PageHeader;
