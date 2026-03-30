import {
  useGetNotificationsQuery,
  useGetNotificationUnreadQuery,
  useMarkAllAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/redux/features/notifications/notificationsApi";
import { Notification } from "@/redux/types/notifications.type";
import { useState, useEffect, useMemo } from "react";

// Helper to format relative time (e.g., "7w", "2d", "1h")
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear}y`;
  if (diffMonth > 0) return `${diffMonth}mo`;
  if (diffWeek > 0) return `${diffWeek}w`;
  if (diffDay > 0) return `${diffDay}d`;
  if (diffHour > 0) return `${diffHour}h`;
  if (diffMin > 0) return `${diffMin}m`;
  return "now";
}

// Helper to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Consistent color based on id
function getAvatarColor(id: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const index =
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
}

const INITIAL_VISIBLE_COUNT = 10;
const LOAD_MORE_COUNT = 10;

// Skeleton component for notification items
function NotificationSkeleton({ count = INITIAL_VISIBLE_COUNT }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm animate-pulse"
        >
          {/* Left section */}
          <div className="flex items-center gap-4 flex-1">
            {/* Unread bell placeholder (wider to match bell size) */}
            <div className="w-6 h-6 bg-gray-200 rounded shrink-0" />
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
            {/* Text placeholders */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          {/* Post thumbnail placeholder */}
          <div className="w-12 h-12 bg-gray-200 rounded-md shrink-0 ml-4" />
        </div>
      ))}
    </div>
  );
}

// Bell icon component (solid red bell for unread)
function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-red-500"
    >
      <path
        fillRule="evenodd"
        d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.543 1.232H3.675a.75.75 0 01-.543-1.232A8.25 8.25 0 005.25 9.75V9zM7.5 15.75v1.5a4.5 4.5 0 009 0v-1.5h-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Unread">("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Fetch data based on filter
  const {
    data: allNotifications,
    isLoading: allLoading,
    error: allError,
  } = useGetNotificationsQuery(undefined, { skip: activeFilter !== "All" });

  const {
    data: unreadNotifications,
    isLoading: unreadLoading,
    error: unreadError,
  } = useGetNotificationUnreadQuery(undefined, {
    skip: activeFilter !== "Unread",
  });

  // Mutations
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllAsReadMutation();

  // Determine current notifications and loading/error state
  const notifications =
    activeFilter === "All" ? allNotifications : unreadNotifications;
  const isLoading = activeFilter === "All" ? allLoading : unreadLoading;
  const error = activeFilter === "All" ? allError : unreadError;

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeFilter]);

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      // Optionally show a success toast
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Handle single notification click
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
    // Optionally navigate to the post/highlight
    // if (notification.postId) { router.push(...) }
  };

  // Load more notifications
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const unreadCount = useMemo(() => {
    if (activeFilter === "All") {
      return allNotifications?.filter((n) => !n.isRead).length;
    } else {
      return unreadNotifications?.length;
    }
  }, [activeFilter, allNotifications, unreadNotifications]);

  // Determine which notifications to display
  const displayedNotifications = notifications?.slice(0, visibleCount) || [];
  const hasMore = notifications ? notifications.length > visibleCount : false;

  // Render loading state with skeleton
  if (isLoading) {
    return (
      <div className="w-full p-0">
        {/* Header (static) */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with your latest notifications
          </p>
        </div>

        {/* Filter and Mark All skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            {["All", "Unread"].map((filter) => (
              <div
                key={filter}
                className="px-6 py-2 rounded-full bg-gray-200 w-20 h-10 animate-pulse"
              />
            ))}
          </div>
          <div className="px-6 py-2 rounded-full bg-gray-200 w-32 h-10 animate-pulse" />
        </div>

        {/* Notification list skeleton */}
        <NotificationSkeleton count={INITIAL_VISIBLE_COUNT} />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load notifications. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full p-2 sm:p-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Stay updated with your latest notifications
        </p>
      </div>

      {/* Filter and Mark All row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {(["All", "Unread"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full cursor-pointer border text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-green-500 text-white border-green-500"
                  : "text-green-600 border-green-500 bg-white hover:bg-green-50"
              }`}
            >
              {filter}
              {filter === "Unread" &&
                unreadCount !== undefined &&
                unreadCount > 0 && (
                  <span
                    className={`ml-1.5 sm:ml-2 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold ${
                      activeFilter === "Unread"
                        ? "bg-white text-green-600"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
            </button>
          ))}
        </div>

        {notifications && notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-green-500 rounded-full text-green-600 text-sm sm:text-base font-medium hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isMarkingAll ? "Marking..." : "✓ Mark all as read"}
          </button>
        )}
      </div>

      {/* Notification list */}
      {displayedNotifications.length > 0 ? (
        <div className="space-y-4">
          {displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                !notification.isRead ? "bg-green-100" : "bg-white"
              }`}
            >
              {/* Left section with red bell for unread */}
              <div className="flex items-center gap-4 flex-1">
                {/* Bell icon for unread; empty placeholder for read to keep alignment */}
                <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                  {!notification.isRead && <BellIcon />}
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {notification.sender.imgUrl ? (
                    <img
                      src={notification.sender.imgUrl}
                      alt={notification.sender.athleteFullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                        notification.senderId,
                      )}`}
                    >
                      {getInitials(notification.sender.athleteFullName)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">
                      {notification.sender.athleteFullName}
                    </span>{" "}
                    {notification.message
                      .replace(notification.sender.athleteFullName, "")
                      .trim()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </div>
              {notification.post?.images?.[0]?.url && (
                <div className="w-12 h-12 bg-gray-300 rounded-md overflow-hidden shrink-0 ml-4">
                  <img
                    src={notification.post.images[0].url}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}

          {/* See more button or end message */}
          {hasMore ? (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 border border-green-500 rounded-full text-green-600 font-medium hover:bg-green-50 transition-colors cursor-pointer"
              >
                See more
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              You've reached to the end
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          No notifications to show.
        </div>
      )}
    </div>
  );
}
