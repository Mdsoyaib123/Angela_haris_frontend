import copy from "@/assets/angelaharris/logo/copy.svg";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { useNavigate } from "react-router-dom";
import ProfileDataCard from "./ProfileDataCard";
import messageDot from "@/assets/angelaharris/message-dot.svg";
import { useGetCurrentUserQuery } from "@/redux/features/profile/profileApi";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
// import { useCurrentPlanQuery } from "@/redux/features/stripe/stripeApi";
import UpgradeModal from "@/components/Shared/UpgradeModal";
import { SendEmailModal } from "./SendEmailModal";

// Skeleton component for loading state
const ProfileCardSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-12">
        {/* Image & Actions */}
        <div className="flex flex-col justify-between items-center lg:items-start w-full lg:max-w-sm space-y-6 lg:space-y-8">
          <div className="flex justify-center w-full">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gray-200" />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
            <div className="flex-1 min-w-30 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 min-w-30 h-10 bg-gray-200 rounded-full" />
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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="w-full h-10 bg-gray-200 rounded-full" />
          <div className="w-full h-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

const ProfileCard = () => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data, error, isLoading } = useGetCurrentUserQuery();
  const user = data?.data?.user;
  console.log("user", user);
  // const { data: currentPlanData } = useCurrentPlanQuery();
  // const hasPremiumPlan = !!currentPlanData?.data;

  const { data: userData } = useAuthMeQuery();
  const hasPremiumPlan = userData?.data?.user.subscribeStatus === "FREE";
  const myId: string = userData?.data?.user?.id ?? "";
  const handleCopyProfileLink = async () => {
    if (hasPremiumPlan) {
      setShowUpgradeModal(true);
      return;
    }
    if (!myId) return;
    const url = `${window.location.origin}/user/${myId}`;
    try {
      await navigator.clipboard.writeText(url);
      // Optional: add a success toast here
      toast.success(
        `${user?.athleteFullName} profile link is copied successfully`,
      );
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <ProfileCardSkeleton />;
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
  const aauClubDisplay = user.clubTeam || "—";
  const positionDisplay = user.position || "—";
  const gpaDisplay = user.gpa ? `${user.gpa}` : "—";
  const parentNameDisplay = user.parentName || "—";
  const parentEmailDisplay = user.email || "—";
  const parentNumberDisplay = user.phoneNumber || "—";
  const dominateHand = user?.dominateHand || "—";
  const jerseyNumber = user?.jerseyNumber || "—";
  const dateOfBirthDisplay = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "—";

  // Helper function with proper types
  function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust if birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  // Usage in your component
  const ageDisplay = user.dateOfBirth
    ? (() => {
      const birthDate = new Date(user.dateOfBirth);
      // Check if the date is valid (e.g., not "Invalid Date")
      if (isNaN(birthDate.getTime())) {
        return "—"; // fallback for invalid date strings
      }
      return `${calculateAge(birthDate)} years`;
    })()
    : "—";
  // Prepare stats for ProfileDataCard
  const stats = {
    ppg: user.ppg,
    rpg: user.rpg,
    blk: user.blk,
    apg: user.apg,
    spg: user.spg,
  };

  return (
    <>
      <div className="w-full space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-12">
          {/* Profile Image & Actions */}
          <div className="flex flex-col justify-between items-center lg:items-start w-full lg:max-w-sm space-y-6 lg:space-y-8">
            <div className="flex justify-center flex-col items-center gap-4 w-full">
              <img
                src={
                  user.imgUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.athleteFullName || "User")}&background=random`
                }
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-2 border-gray-300"
              />
              <p className="text-sm sm:text-base text-gray-700 text-center px-4 italic max-w-sm">
                "{bioDisplay}"
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
              <button
                onClick={() => setIsEditProfileModalOpen(true)}
                className="flex-1 min-w-30 px-4 py-2 cursor-pointer bg-white border border-green-500 text-green-500 rounded-full hover:bg-green-50 transition"
              >
                Edit Profile
              </button>

              <button
                onClick={() => navigate("/user-dashboard/subscription")}
                className="flex-1 min-w-30 px-4 py-2 cursor-pointer bg-white border border-green-500 text-green-500 rounded-full hover:bg-green-50 transition"
              >
                Manage Plan
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-6">
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                {user.athleteFullName || "MonNom"}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 text-sm sm:text-base text-gray-700">
              <div className="space-y-1">
                <div>
                  <span className="font-semibold">AAU/Travel Team:</span>{" "}
                  {aauClubDisplay}
                </div>
                <div>
                  <span className="font-semibold">Sports:</span>{" "}
                  {user.sports || "—"}
                </div>
                <div>
                  <span className="font-semibold">Position:</span>{" "}
                  {positionDisplay}
                </div>
                <div>
                  <span className="font-semibold">Height:</span> {heightDisplay}
                </div>
                <div>
                  <span className="font-semibold">Weight:</span> {weightDisplay}
                </div>
                <div>
                  <span className="font-semibold">Date of Birth:</span>{" "}
                  {dateOfBirthDisplay}
                </div>
                <div>
                  <span className="font-semibold">Dominate Hand:</span>{" "}
                  {dominateHand}
                </div>
              </div>

              <div className="space-y-1">
                <div>
                  <span className="font-semibold">City:</span> {cityDisplay}
                </div>
                <div>
                  <span className="font-semibold">State:</span> {stateDisplay}
                </div>
                <div>
                  <span className="font-semibold">School:</span> {schoolDisplay}
                </div>
                <div>
                  <span className="font-semibold">Grad Year:</span>{" "}
                  {gradYearDisplay}
                </div>
                <div>
                  <span className="font-semibold">Jersey Number:</span>{" "}
                  {jerseyNumber}
                </div>
                <div>
                  <span className="font-semibold">GPA:</span> {gpaDisplay}
                </div>
                <div>
                  <span className="font-semibold">Age:</span> {ageDisplay}
                </div>
              </div>

              {user.role === "PARENT" && (
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Parent Name:</span>{" "}
                    {parentNameDisplay}
                  </div>
                  <div>
                    <span className="font-semibold">Parent Email:</span>{" "}
                    {parentEmailDisplay}
                  </div>
                  <div>
                    <span className="font-semibold">Parent Number:</span>{" "}
                    {parentNumberDisplay}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card - now receives real data */}
        <div>
          <ProfileDataCard stats={stats} />
        </div>

        {/* Skill Section */}
        <div className="bg-[#E6F6ED] shadow-lg rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
              Ready to show your skills?
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Create your unique recruitment profile link and share performance
              history with coaches
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
            <div className="w-full flex-col flex items-center gap-2">
              <button
                onClick={handleCopyProfileLink}
                className="w-full px-6 py-2 bg-white border border-green-500 text-green-500 rounded-full hover:bg-green-100 transition flex items-center justify-center cursor-pointer"
              >
                <img src={copy} alt="Copy" className="mr-2 w-4 h-4" />
                Generate Link
              </button>
            </div>

            <button
              onClick={() => {
                if (!hasPremiumPlan) {
                  setIsSendEmailModalOpen(true);
                } else {
                  setShowUpgradeModal(true);
                }
              }}
              className={`w-full px-6 py-2 text-white font-medium rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md cursor-pointer flex justify-center items-center gap-2`}
            >
              <img src={messageDot} alt="message dot icon" />
              Send Email
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
      />

      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
      // links={`PROFILE LINK: ${window.location.origin}/${myId}`}  adjust based on available user fields
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
};

export default ProfileCard;
