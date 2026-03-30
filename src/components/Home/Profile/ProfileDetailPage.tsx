import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileDataCard from "./ProfileDataCard";
import {
  useGetUserByIdQuery,
  useProfileViewMutation,
} from "@/redux/features/profile/profileApi";

// Skeleton component for loading state
const ProfileDetailPageSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-12">
        {/* Image & Actions */}
        <div className="flex flex-col justify-between items-center lg:items-start w-full lg:max-w-sm space-y-6 lg:space-y-8">
          <div className="flex justify-center w-full">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="flex-1 space-y-6">
          <div className="text-center lg:text-left space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto lg:mx-0" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto lg:mx-0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card Skeleton */}
      <div className="h-40 bg-gray-200 rounded-2xl" />

      {/* Skill Section Skeleton */}
      <div className="bg-[#E6F6ED] shadow-lg rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="text-center lg:text-left space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto lg:mx-0" />
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto lg:mx-0" />
        </div>
      </div>
    </div>
  );
};

const ProfileDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [profileView] = useProfileViewMutation();

  useEffect(() => {
    if (id) {
      profileView(id).catch((err) => {
        console.error("Failed to track profile view:", err);
      });
    }
  }, [id, profileView]);

  const { data, isLoading, error } = useGetUserByIdQuery(id as string, {
    skip: !id,
  });
  const user = data?.data;
  console.log(data);
  if (isLoading) {
    return <ProfileDetailPageSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  // Format display values
  const heightDisplay = user.height
    ? (() => {
        const totalInches = Number(user.height);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return `${feet}'${inches}"`;
      })()
    : "—";

  const weightDisplay = user.weight ? `${user.weight} lbs` : "—";
  const gradYearDisplay = user.gradYear ?? "—";
  const schoolDisplay = user.school || "—";
  const cityDisplay = user.city || "—";
  const stateDisplay = user.state || "—";
  const bioDisplay = user.bio || "—";
  const aauClubDisplay = user.clubTeam || user.aauClub || "—";
  const positionDisplay = user.position || "—";
  const gpaDisplay = user.gpa ? `${user.gpa}` : "—";
  const parentNameDisplay = user.parentName || "—";
  const parentEmailDisplay = user.email || user.parentEmail || "—";
  const parentNumberDisplay = user.phoneNumber || "—";
  const dateOfBirthDisplay = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  // Helper function for age calculation
  function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const ageDisplay = user.dateOfBirth
    ? (() => {
        const birthDate = new Date(user.dateOfBirth);
        if (isNaN(birthDate.getTime())) return "—";
        return `${calculateAge(birthDate)} years`;
      })()
    : "—";
  // Helper function with proper types
  // function calculateAge(birthDate: Date): number {
  //   const today = new Date();
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();

  //   // Adjust if birthday hasn't occurred yet this year
  //   if (
  //     monthDiff < 0 ||
  //     (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //   ) {
  //     age--;
  //   }
  //   return age;
  // }

  // Usage in your component
  // const ageDisplay = user.dateOfBirth
  //   ? (() => {
  //     const birthDate = new Date(user.dateOfBirth);
  //     // Check if the date is valid (e.g., not "Invalid Date")
  //     if (isNaN(birthDate.getTime())) {
  //       return "—"; // fallback for invalid date strings
  //     }
  //     return `${calculateAge(birthDate)} years`;
  //   })()
  //   : "—";

  // Prepare stats for ProfileDataCard
  const stats = {
    ppg: user.ppg,
    rpg: user.rpg,
    blk: user.blk,
    apg: user.apg,
    spg: user.spg,
  };

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8 sm:mb-12">
        {/* Profile Image & Bio */}
        <div className="flex flex-col justify-between items-center lg:items-start w-full lg:max-w-sm space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex justify-center flex-col items-center lg:items-start gap-3 sm:gap-4 w-full">
            <img
              src={
                user.imgUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.athleteFullName || "User",
                )}&background=random`
              }
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-2 border-gray-300 shadow-sm"
            />
            <p className="text-xs sm:text-sm text-gray-600 text-center lg:text-left px-2 sm:px-0 italic max-w-sm">
              "{bioDisplay}"
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {user.athleteFullName || "Athlete Name"}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-3 gap-x-6 text-sm sm:text-base text-gray-700">
            <div className="space-y-2">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  AAU/Travel Team
                </span>
                <span className="font-medium">{aauClubDisplay}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Sports
                </span>
                <span className="font-medium">{user.sports || "—"}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Position
                </span>
                <span className="font-medium">{positionDisplay}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Grad Year
                </span>
                <span className="font-medium">{gradYearDisplay}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Height / Weight
                </span>
                <span className="font-medium">
                  {heightDisplay} / {weightDisplay}
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  GPA / Age
                </span>
                <span className="font-medium">
                  {gpaDisplay} / {ageDisplay}
                </span>
              </div>
            </div>

            <div className="space-y-2 col-span-1 sm:col-span-2 xl:col-span-1">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Location & School
                </span>
                <span className="font-medium">
                  {cityDisplay}, {stateDisplay}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {schoolDisplay}
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Date of Birth
                </span>
                <span className="font-medium">{dateOfBirthDisplay}</span>
              </div>
              {user.role !== "ATHLATE" && (
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Parent Info
                  </span>
                  <span className="font-medium text-sm">
                    {parentNameDisplay}
                  </span>
                  <span className="text-xs text-gray-500">
                    {parentEmailDisplay}
                  </span>
                  <span className="text-xs text-gray-500">
                    {parentNumberDisplay}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div>
        <ProfileDataCard stats={stats} />
      </div>

      {/* Skill Section (Optional for Public View - showing copy/share only) */}
      {/* <div className="bg-[#E6F6ED] shadow-lg rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="text-center lg:text-left space-y-4">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
            Share this Profile
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Copy the profile link to share performance history with coaches and recruiters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
          <div className="w-full flex-col flex items-center gap-2">
            <button
              onClick={handleCopyProfileLink}
              className="w-full px-6 py-2 bg-white border border-green-500 text-green-500 rounded-full hover:bg-green-100 transition flex items-center justify-center cursor-pointer"
            >
              <img src={copy} alt="Copy" className="mr-2 w-4 h-4" />
              Copy Profile Link
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileDetailPage;
