// src/components/admin/users/ProfileDetailsCard.tsx

import { X } from "lucide-react";
import { ExtendedUserDetails } from "@/redux/types/AdminAllUserType";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";

interface ProfileDetailsCardProps {
  userData?: ExtendedUserDetails | null;
  onClose: () => void;
  isOpen: boolean;
}

// interface ReferredUser {
//   id: string;
//   athleteFullName: string;
//   email: string;
//   createdAt: string; // ISO date string
//   subscribeStatus: string; // e.g., "PRO", "ELITE", "FREE"
//   profileLink: string | null;
// }

export default function ProfileDetailsCard({
  userData,
  onClose,
  isOpen = false,
}: ProfileDetailsCardProps) {
  if (!isOpen || !userData) return null;

  // const getBadgeClasses = (color: string) => {
  //   return color === "green"
  //     ? "bg-[#EBFFF2] text-[#007E37]"
  //     : "bg-[#EBF8FF] text-[#004A7E]";
  // };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-[#FBEBFF] text-[#CD13D0]";
      case "SUPER_USER":
        return "bg-[#FFFFC7] text-[#CEA500]";
      case "ATHLATE":
        return "bg-[#EBF3FF] text-[#0088FF]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadge = () => {
    if (userData.isDeleted) {
      return { label: "Deleted", color: "bg-red-100 text-red-600" };
    }
    return userData.isActive
      ? { label: "Active", color: "bg-[#EBFFF2] text-[#007E37]" }
      : { label: "Inactive", color: "bg-gray-100 text-gray-600" };
  };

  const status = getStatusBadge();

  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // const formatHeight = (height: number) => {
  //   if (!height) return "N/A";
  //   const feet = Math.floor(height / 30.48);
  //   const inches = Math.round((height % 30.48) / 2.54);
  //   return `${feet}'${inches}"`;
  // };

  const heightDisplay = userData.height
    ? (() => {
        const totalInches = Number(userData.height);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return `${feet}'${inches}"`;
      })()
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] rounded-lg bg-gray-50 p-6 shadow-lg overflow-y-auto overscroll-contain scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-2 mb-5 border-b border-[#C6CAD1]">
          <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="text-[#28303F] cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="mb-2 flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-linear-to-br from-[#6FAACC] to-[#395C70] flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {userData.athleteFullName?.charAt(0) || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {userData.athleteFullName}
            </h3>

            <p className="text-sm text-gray-500 break-all">{userData.email}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(
                  userData.role,
                )}`}
              >
                {userData.role === "ATHLATE" ? "Athlete" : userData.role}
              </span>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
              >
                {status.label}
              </span>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  userData.subscribeStatus === "FREE"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-[#EBFFF2] text-[#007E37]"
                }`}
              >
                {userData.subscribeStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h4 className="mb-3 text-base font-normal uppercase tracking-normal text-[#475569]">
            Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-4 bg-white rounded-lg border border-[#EFEEEE] p-4">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium">{userData.athleteFullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="text-sm font-medium">
                {formatDateOfBirth(userData.dateOfBirth)}
              </p>
            </div>
            {userData.role === "PARENT" && (
              <div>
                <p className="text-xs text-gray-500">Parent Name</p>
                <p className="text-sm font-medium">
                  {userData.parentName || "N/A"}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">City, State</p>
              <p className="text-sm font-medium">
                {userData.city && userData.state
                  ? `${userData.city}, ${userData.state}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-sm font-medium">
                {formatDate(userData.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">School</p>
              <p className="text-sm font-medium">{userData.school || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Graduation Year</p>
              <p className="text-sm font-medium">
                {userData.gradYear || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Position</p>
              <p className="text-sm font-medium">
                {userData.position || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">GPA</p>
              <p className="text-sm font-medium">{userData.gpa || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Height</p>
              <p className="text-sm font-medium">
                {userData.height ? heightDisplay : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-sm font-medium">
                {userData.weight ? `${userData.weight} lbs` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Athletic Information
        <div className="mb-6">
          <h4 className="mb-3 text-base font-normal uppercase tracking-normal text-[#475569]">
            Athletic Information
          </h4>
        </div> */}

        {/* Stats Section */}
        {(userData.ppg ||
          userData.rpg ||
          userData.apg ||
          userData.spg ||
          userData.blk) && (
          <div className="mb-6">
            <h4 className="mb-3 text-base font-normal uppercase tracking-normal text-[#475569]">
              Basketball Stats
            </h4>
            <div className="grid grid-cols-5 gap-3">
              {userData.ppg !== null && (
                <div className="bg-white rounded-lg border border-[#EFEEEE] p-3 text-center">
                  <p className="text-xs text-gray-500">PPG</p>
                  <p className="text-sm font-medium">{userData.ppg}</p>
                </div>
              )}
              {userData.rpg !== null && (
                <div className="bg-white rounded-lg border border-[#EFEEEE] p-3 text-center">
                  <p className="text-xs text-gray-500">RPG</p>
                  <p className="text-sm font-medium">{userData.rpg}</p>
                </div>
              )}
              {userData.blk !== null && (
                <div className="bg-white rounded-lg border border-[#EFEEEE] p-3 text-center">
                  <p className="text-xs text-gray-500">BPG</p>
                  <p className="text-sm font-medium">{userData.blk}</p>
                </div>
              )}
              {userData.apg !== null && (
                <div className="bg-white rounded-lg border border-[#EFEEEE] p-3 text-center">
                  <p className="text-xs text-gray-500">APG</p>
                  <p className="text-sm font-medium">{userData.apg}</p>
                </div>
              )}
              {userData.spg !== null && (
                <div className="bg-white rounded-lg border border-[#EFEEEE] p-3 text-center">
                  <p className="text-xs text-gray-500">SPG</p>
                  <p className="text-sm font-medium">{userData.spg}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Views */}
        <div className="mb-6">
          <h4 className="mb-3 text-base font-normal uppercase tracking-normal text-[#475569]">
            Profile Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-[#EFEEEE] p-4">
              <p className="text-xs text-gray-500">Profile Views</p>
              <p className="text-xl font-bold text-[#2EBC03]">
                {userData.profileViews || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-[#EFEEEE] p-4">
              <p className="text-xs text-gray-500">Total Highlights</p>
              <p className="text-xl font-bold text-[#2EBC03]">
                {userData.totalHighlights || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Referral Information */}
        <div className="mb-6">
          <h4 className="mb-3 text-base font-normal uppercase tracking-normal text-[#475569]">
            Referral Information
          </h4>
          <div className="grid grid-cols-2 gap-4 bg-white rounded-lg border border-[#EFEEEE] p-4">
            <div>
              <p className="text-xs text-gray-500">Referral Code</p>
              <p className="text-sm font-medium">{userData.referralCode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Referred By</p>
              <p className="text-sm font-medium">
                {userData.referredBy || "None"}
              </p>
            </div>
          </div>
        </div>

        {/* Referred users */}
        {/* {userData.referredUsers && userData.referredUsers.count > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-base font-normal uppercase tracking-normal text-[#475569]">
              Referred Users ({userData.referredUsers.count})
            </h4>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-full">
                <thead className="bg-[#EFEEEE]">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Name</th>
                    <th className="p-3 text-left text-sm font-medium">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData.referredUsers.list.map((referred: ReferredUser) => (
                    <tr key={referred.id} className="border-b border-[#E0E0E1]">
                      <td className="p-3 text-sm">
                        {referred.athleteFullName}
                      </td>
                      <td className="p-3 text-sm">
                        {formatDate(referred.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {/* Profile Link */}
        <div className="mb-6">
          <h4 className="mb-3 text-base font-normal uppercase tracking-normal text-[#475569]">
            Profile Link
          </h4>
          <Link
            to={`${window.location.origin}/user/${userData.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline break-all"
          >
            {`${window.location.origin}/user/${userData.id}`}
          </Link>
        </div>
      </div>
    </div>
  );
}
