import { cn } from "@/lib/utils";
import PageHeader from "./PageHeader";

type Props = {
  children: React.ReactNode;
  title: string;
  className?: string;
  addButton?: React.ReactNode;
};
const PageContainer = ({ children, title, addButton, className }: Props) => {
  return (
    <div className={cn("container", className)}>
      <div className="flex flex-row justify-between items-center mr-10 mb-10 border-b border-accent pb-2">
        <PageHeader>{title}</PageHeader>
        {addButton}
      </div>
      {children}
    </div>
  );
};
export default PageContainer;
