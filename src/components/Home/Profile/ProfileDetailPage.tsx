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
  const dominateHandDisplay = user.dominateHand || "—";
  const jerseyNumberDisplay = user.jerseyNumber ? `${user.jerseyNumber}` : "—";
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
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8 sm:mb-12 bg-white lg:bg-transparent rounded-3xl lg:rounded-none shadow-sm lg:shadow-none border border-gray-100 lg:border-none p-6 lg:p-0 relative overflow-hidden">
        {/* Decorative background for mobile */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-r from-green-50 to-green-100 lg:hidden rounded-t-3xl -z-10"></div>

        {/* Profile Image & Actions */}
        <div className="flex flex-col justify-between items-center lg:items-start w-full lg:max-w-sm space-y-4 sm:space-y-6 lg:space-y-8 z-10 pt-4 lg:pt-0">
          <div className="flex justify-center flex-col items-center gap-4 w-full">
            <div className="relative">
              <img
                src={
                  user.imgUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.athleteFullName || "User")}&background=random`
                }
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-md lg:border-2 lg:border-gray-300 lg:shadow-none"
              />
            </div>

            <div className="text-center lg:hidden space-y-1 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.athleteFullName || "MonNom"}
              </h1>
              <p className="text-sm font-medium text-green-600">
                {positionDisplay !== "—" ? positionDisplay : "Athlete"}
              </p>
            </div>

            <p className="text-sm sm:text-base text-gray-600 text-center px-4 italic max-w-sm bg-gray-50 lg:bg-transparent py-3 lg:py-0 rounded-xl lg:rounded-none border border-gray-100 lg:border-none w-full">
              "{bioDisplay}"
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-6 relative">
          <div className="hidden lg:block text-left space-y-2 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.athleteFullName || "MonNom"}
            </h1>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 lg:bg-transparent lg:p-0 border border-gray-100 lg:border-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-5 gap-x-6 text-sm sm:text-base text-gray-800">
              <div className="space-y-3">
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">AAU/Travel Team:</span>
                  <span className="font-medium sm:font-normal ml-2">{aauClubDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Sports:</span>
                  <span className="font-medium sm:font-normal ml-2">{user.sports || "—"}</span>
                </div>
                <div className="flex lg:hidden justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Position:</span>
                  <span className="font-medium sm:font-normal ml-2">{positionDisplay}</span>
                </div>
                <div className="hidden lg:flex  sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Position:</span>
                  <span className="font-medium sm:font-normal ml-2">{positionDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Height:</span>
                  <span className="font-medium sm:font-normal ml-2">{heightDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Weight:</span>
                  <span className="font-medium sm:font-normal ml-2">{weightDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Date of Birth:</span>
                  <span className="font-medium sm:font-normal ml-2">{dateOfBirthDisplay}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Dominate Hand:</span>
                  <span className="font-medium sm:font-normal ml-2">{dominateHandDisplay}</span>
                </div>
              </div>

              <div className="space-y-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-gray-200">
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">City:</span>
                  <span className="font-medium sm:font-normal ml-2">{cityDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">State:</span>
                  <span className="font-medium sm:font-normal ml-2">{stateDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">School:</span>
                  <span className="font-medium sm:font-normal ml-2">{schoolDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Grad Year:</span>
                  <span className="font-medium sm:font-normal ml-2">{gradYearDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Jersey Number:</span>
                  <span className="font-medium sm:font-normal ml-2">{jerseyNumberDisplay}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">GPA:</span>
                  <span className="font-medium sm:font-normal ml-2">{gpaDisplay}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-gray-500 sm:text-gray-900">Age:</span>
                  <span className="font-medium sm:font-normal ml-2">{ageDisplay}</span>
                </div>
              </div>

              {user.role === "PARENT" && (
                <div className="space-y-3 mt-4 xl:mt-0 pt-4 xl:pt-0 border-t xl:border-none border-gray-200">
                  <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                    <span className="font-semibold text-gray-500 sm:text-gray-900">Parent Name:</span>
                    <span className="font-medium sm:font-normal ml-2">{parentNameDisplay}</span>
                  </div>
                  <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
                    <span className="font-semibold text-gray-500 sm:text-gray-900">Parent Email:</span>
                    <span className="font-medium sm:font-normal ml-2">{parentEmailDisplay}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="font-semibold text-gray-500 sm:text-gray-900">Parent Number:</span>
                    <span className="font-medium sm:font-normal ml-2">{parentNumberDisplay}</span>
                  </div>
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

    </div>
  );
};

export default ProfileDetailPage;
