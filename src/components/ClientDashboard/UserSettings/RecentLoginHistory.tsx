import { useState } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { LoginSession } from "@/redux/types/auth.type";
import { useGetLoginSessionsQuery } from "@/redux/features/auth/authApi";

// Helper function to format time nicely
const formatLoginTime = (isoString: string): string => {
  const date = parseISO(isoString);
  if (isToday(date)) {
    return `Today, ${format(date, "h:mm a")}`;
  }
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, yyyy");
};

// Helper to construct location string
const formatLocation = (session: LoginSession): string => {
  const parts = [];
  if (session.city) parts.push(session.city);
  if (session.region) parts.push(session.region);
  if (session.country) parts.push(session.country);
  if (parts.length > 0) return parts.join(", ");
  return session.ipAddress || "Unknown location";
};

export default function RecentLoginHistory() {
  const { data: response, isLoading, error } = useGetLoginSessionsQuery();
  const [visibleCount, setVisibleCount] = useState(6);

  const sessions = response?.data || [];
  const displayedSessions = sessions.slice(0, visibleCount);
  const hasMore = visibleCount < sessions.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div>
      <h1 className="text-[#0F1325] font-semibold text-xl mb-3 lg:mb-6">
        Recent Login History
      </h1>

      {isLoading && (
        <div className="text-center py-4 text-gray-500">
          Loading login sessions...
        </div>
      )}
      {error && (
        <div className="text-center py-4 text-red-500">
          Failed to load login history. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <div className="w-full flex flex-col xl:flex-row xl:items-start gap-4 xl:gap-6">
          <div className="w-full order-2 xl:order-1 xl:flex-[2.4]">
            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5 grow">
              <div className="xl:col-span-4 w-full h-full">
                <div className="overflow-x-auto rounded-lg border border-gray-200 h-full flex flex-col">
                  <table className="w-full min-w-75">
                    <thead className="bg-[#EFEEEE] w-full">
                      <tr>
                        <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                          DEVICE
                        </th>
                        <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                          LOCATION
                        </th>
                        <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                          TIME
                        </th>
                        <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedSessions.map((session) => (
                        <tr
                          key={session.id}
                          className="border-b border-[#E0E0E1]"
                        >
                          <td className="align-middle p-3 whitespace-nowrap">
                            <span className="text-base text-[#1E242C] font-medium">
                              {session.device}
                            </span>
                          </td>
                          <td className="align-middle p-3 whitespace-nowrap">
                            <span className="text-base text-[#1E242C] font-medium">
                              {formatLocation(session)}
                            </span>
                          </td>
                          <td className="align-middle p-3 whitespace-nowrap">
                            <span className="text-base text-[#1E242C] font-medium">
                              {formatLoginTime(
                                session.lastActive || session.createdAt,
                              )}
                            </span>
                          </td>
                          <td className="align-middle p-3 whitespace-nowrap">
                            <span
                              className={`text-base font-medium ${
                                session.isActive
                                  ? "text-[#2EBC03]"
                                  : "text-[#1E242C]"
                              }`}
                            >
                              {session.isActive ? "Active" : "Logged Out"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {sessions.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-4 text-gray-500"
                          >
                            No login sessions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="p-3 bg-[#EFEEEE]">
                          {/* Grid layout keeps the main button centered while the "See More" sits on the right */}
                          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left spacer – ensures true centering */}
                            <div></div>

                            {/* Centered "Sign out of all other devices" */}
                            <div>
                              {/* <button className="text-red-500 font-semibold cursor-pointer">
                                Sign out of all other devices
                              </button> */}
                            </div>

                            {/* Right side – contains "See More" button or remains empty */}
                            <div className="flex justify-end">
                              {hasMore && (
                                <button
                                  onClick={handleSeeMore}
                                  className="text-green-600 font-semibold cursor-pointer hover:underline"
                                >
                                  See More
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
