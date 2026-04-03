import React from "react";

interface AvatarProps {
  user?: {
    name?: string;
    athleteFullName?: string;
    imgUrl?: string;
  };
  className?: string;
}

const Avatar = ({ user, className = "" }: AvatarProps) => {
  // Extract initials from user's name (fallback to '?')
  const getInitials = () => {
    const displayName = user?.athleteFullName || user?.name;
    if (!displayName) return "?";
    const names = displayName.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // If user has an image, use it
  if (user?.imgUrl) {
    return (
      <img
        src={user?.imgUrl}
        alt={user?.athleteFullName || user?.name || "User avatar"}
        className={`rounded-full object-cover border-2 border-gray-300 ${className}`}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          // If image fails to load, show fallback instead
          e.currentTarget.style.display = "none"; // hide broken image
          const fallback = e.currentTarget.parentElement?.querySelector(
            ".avatar-fallback",
          ) as HTMLElement;
          if (fallback) {
            fallback.style.display = "flex";
          }
        }}
      />
    );
  }

  // Fallback: initials or default icon
  return (
    <div
      className={`avatar-fallback rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-medium border-2 border-gray-300 ${className}`}
      style={{ display: "flex" }} // ensure it's visible
    >
      {getInitials()}
    </div>
  );
};

export default Avatar;
