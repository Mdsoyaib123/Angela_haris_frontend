import { useState } from "react";
import { Copy } from "lucide-react";
import RowActionsDropdown from "./RowActionsDropdown";
import SearchHeader from "./SearchHeader";
import { useGetAllOrganizationsQuery } from "@/redux/features/organization/organizationApi";
import TableSkeleton from "@/components/Reuseable/TableSkeleton";
import { toast } from "sonner";

const ROWS_PER_PAGE = 9;

export default function GenerateLinks() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetAllOrganizationsQuery();
  const organizations = data?.data ?? [];
  const filtered = organizations.filter((org) =>
    `${org.organizationName} ${org.organizationCode} ${org.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(organizations.length / ROWS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ROWS_PER_PAGE);
  console.log("search", search);
  return (
    <div className="relative">
      <SearchHeader value={search} onChange={setSearch} />

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5 grow">
        <div className="xl:col-span-4 w-full h-full">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
            <table className="w-full">
              <thead className="bg-[#EFEEEE] border-b border-gray-200">
                <tr>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Organization Name
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Code
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Email
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Shareable Link
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Referred Users
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Comm. Rate (%)
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Total Earned
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Withdrawable Balance
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && <TableSkeleton rows={ROWS_PER_PAGE} />}
                {isError && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm font-bold text-red-500">
                          Failed to load organizations
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Try again
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-10 text-center text-gray-400 text-sm font-medium"
                    >
                      No organizations found.
                    </td>
                  </tr>
                )}
                {paginated.map((org: any) => (
                  <tr
                    key={org.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-700">
                        {org.organizationName}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {org.organizationCode}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 font-medium">
                        {org.email}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-500 truncate block max-w-[150px] font-medium">
                          {org.accessUrl.replace(/^https:\/\//, "")}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(org.accessUrl);
                            toast.success("Link copied to clipboard");
                          }}
                          className="p-1.5 hover:bg-blue-50 rounded-md text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <span className="text-sm font-black text-gray-700">
                        {org.uniqueVisitors}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <span className="text-sm font-black text-gray-700">
                        {org.commissionRatePercent}%
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-sm font-black text-green-600">
                        ${Number(org?.totalCommissionEarned || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-sm font-black text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                        ${parseFloat(org?.commissionBalance || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <RowActionsDropdown userData={org} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-5 w-full">
        {/* Shared Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="bg-[#EFEEEE] border border-gray-200 rounded-xl p-3 flex items-center justify-center gap-2 shadow-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              ‹
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isVisible =
                  totalPages <= 7 ||
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1;

                if (!isVisible) {
                  if (page === 2 || page === totalPages - 1)
                    return (
                      <span key={page} className="text-gray-400">
                        ...
                      </span>
                    );
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-7 w-7 flex items-center justify-center rounded-full text-sm transition-all cursor-pointer
                      ${
                        currentPage === page
                          ? "bg-linear-to-b from-[#6FAACC] to-[#395C70] text-white shadow-sm"
                          : "text-black hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
