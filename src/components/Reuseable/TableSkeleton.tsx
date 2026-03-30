import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

type TableSkeletonProps = {
  rows?: number;
};

export default function TableSkeleton({ rows = 9 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow className="border-gray-500 border-b" key={i}>
          <TableCell>
            <Skeleton className="h-4 w-[75%]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[50%]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[65%]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[30%]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[30%]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[30%]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[30%]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-10" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
