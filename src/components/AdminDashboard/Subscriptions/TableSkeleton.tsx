// components/SkeletonLoader.tsx
const SkeletonRow = () => (
  <tr className="border-b border-[#E0E0E1] animate-pulse">
    <td className="p-3">
      <div className="h-6 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="p-3">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="p-3">
      <div className="h-10 bg-gray-200 rounded-full w-28"></div>
    </td>
    <td className="p-3">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="p-3">
      <div className="h-6 bg-gray-200 rounded w-24"></div>
    </td>
  </tr>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <SkeletonRow key={`skeleton-${index}`} />
    ))}
  </>
);
