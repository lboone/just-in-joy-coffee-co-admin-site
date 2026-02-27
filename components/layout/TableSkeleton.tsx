"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, Suspense } from "react";

type Props = {
  numRows: number;
  children: ReactNode;
};
const TableSkeleton = ({ numRows, children }: Props) => {
  return (
    <Suspense
      fallback={
        <Table className="border">
          <TableCaption>
            <Skeleton className="h-4 w-[250px]" />
          </TableCaption>
          <TableHeader>
            <TableHeadSkeleton numRows={numRows} />
          </TableHeader>
          <TableBody>
            <TableRowSkeleton numRows={numRows} />
          </TableBody>
        </Table>
      }
    >
      {children}
    </Suspense>
  );
};
export default TableSkeleton;
type ChildProps = {
  numRows: number;
};
const TableHeadSkeleton = ({ numRows }: ChildProps) => {
  return (
    <TableRow className="bg-secondary">
      {Array.from({ length: numRows }, (_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-12 w-12 rounded-full" />
        </TableCell>
      ))}
    </TableRow>
  );
};
const TableRowSkeleton = ({ numRows }: ChildProps) => {
  return (
    <>
      {Array.from({ length: numRows }, (_, i) => (
        <TableRow key={i}>
          {Array.from({ length: numRows }, (_, j) => (
            <TableCell key={j}>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
