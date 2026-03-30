import { useState, useMemo } from "react";
import SearchHeader from "./SearchHeader";
import RowActionsDropdown from "./RowActionsDropdown";
import ProfileDetailsCard from "./ProfileDetailsCard";
import {
  useGetAllUsersQuery,
  useGetUserDetailsV2Query,
  useManageUserMutation,
} from "@/redux/features/admin/adminAllUser/AdminAllUserApi";
import { User, ExtendedUserDetails } from "@/redux/types/AdminAllUserType";
import { formatDate } from "@/utils/formatDate";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export default function UserAndAthletes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // API hooks
  const { data, isLoading, error, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit: 10,
  });

  const { data: userDetailsData } = useGetUserDetailsV2Query(
    selectedUserId || "",
    {
      skip: !selectedUserId,
    },
  );

  // Extract the actual user data from the nested response
  const selectedUserData = userDetailsData?.data?.data as
    | ExtendedUserDetails
    | undefined;

  // Filter users based on search and role filter
  const filteredUsers = useMemo(() => {
    if (!data?.data?.users) return [];

    return data.data.users.filter((user) => {
      // Filter by role
      if (activeFilter === "Athletes" && user.role !== "ATHLATE") return false;
      if (activeFilter === "Users" && user.role === "ATHLATE") return false;

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          user.athleteFullName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
        );
      }

      return true;
    });
  }, [data, activeFilter, searchTerm]);

  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleViewProfile = (user: User) => {
    setSelectedUserId(user.id);
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedUserId(null);
  };

  const handleManageRole = (user: User) => {
    // This would open a role management modal
    toast.success(`Manage role for ${user.athleteFullName}`);
  };

  // Replace the old mutation hooks
  const [manageUser] = useManageUserMutation();

  // Update handleDeactivate
  const handleDeactivate = async (user: User) => {
    const action = user.isActive ? "deactivate" : "activate";
    try {
      const result = await manageUser({ userId: user.id, action }).unwrap();
      toast.success(result.message || `User ${action}d successfully`);
      refetch();
    } catch {
      toast.error(`Failed to ${action} user`);
    }
  };

  // Update handleDelete
  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${user.athleteFullName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await manageUser({
          userId: user.id,
          action: "delete",
        }).unwrap();
        toast.success(res.message || "User deleted successfully");
        refetch();
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { bg: "bg-[#FBEBFF]", text: "text-[#CD13D0]", label: "Admin" };
      case "SUPER_USER":
        return {
          bg: "bg-[#FFFFC7]",
          text: "text-[#CEA500]",
          label: "Super User",
        };
      case "ATHLATE":
        return { bg: "bg-[#EBF3FF]", text: "text-[#0088FF]", label: "Athlete" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", label: role };
    }
  };

  const getPlanButton = (plan: string) => {
    const planColors = {
      FREE: "bg-[linear-gradient(180deg,#6FAACC_0%,#395C70_100%)]",
      PRO: "bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)]",
      PREMIUM: "bg-[linear-gradient(180deg,#FFB347_0%,#FF8C00_100%)]",
    };
    return planColors[plan as keyof typeof planColors] || planColors.FREE;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error loading users</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <SearchHeader
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5 grow">
        <div className="xl:col-span-4 w-full h-full">
          <div className="overflow-x-auto rounded-lg border border-gray-200 h-full flex flex-col">
            <table className="w-full min-w-250">
              <thead className="bg-[#EFEEEE] w-full">
                <tr>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    User Identity
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Role
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    PLAN
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Joined
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    STATUS
                  </th>
                  <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    const planColor = getPlanButton(user.subscribeStatus);

                    return (
                      <tr key={user.id} className="border-b border-[#E0E0E1]">
                        <td className="align-middle p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#6FAACC] to-[#395C70] flex items-center justify-center text-white text-xs font-bold">
                              {user.athleteFullName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <span className="text-base text-[#1E242C] font-medium block">
                                {user.athleteFullName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span
                            className={`text-base ${roleBadge.text} font-semibold px-4 py-2 rounded-full ${roleBadge.bg} inline-block text-center`}
                          >
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <button
                            className={`text-base font-medium text-white py-2 px-4 rounded-full ${planColor} shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer`}
                          >
                            {user.subscribeStatus}
                          </button>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span className="text-base text-[#1E242C] font-medium">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span
                            className={`text-base font-medium ${
                              user.isActive
                                ? "text-[#2EBC03]"
                                : "text-[#FF0000]"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <RowActionsDropdown
                            user={user}
                            onManageRole={handleManageRole}
                            onDeactivate={handleDeactivate}
                            onDelete={handleDelete}
                            onViewProfile={handleViewProfile}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filteredUsers.length > 0 && (
                <tfoot>
                  {/* Pagination */}
                  <tr>
                    <td colSpan={6} className="p-3 bg-[#EFEEEE]">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing {(currentPage - 1) * 10 + 1} to{" "}
                          {Math.min(
                            currentPage * 10,
                            data?.data?.pagination?.total || 0,
                          )}{" "}
                          of {data?.data?.pagination?.total || 0} users
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Prev */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ‹
                          </button>

                          {/* Page numbers */}
                          {Array.from({ length: totalPages }).map(
                            (_, index) => {
                              const page = index + 1;
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`h-7 w-7 flex items-center justify-center rounded-full text-base cursor-pointer
                                  ${
                                    currentPage === page
                                      ? "bg-linear-to-b from-[#6FAACC] to-[#395C70] text-white"
                                      : "text-black hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            },
                          )}

                          {/* Next */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Profile Details Card as Modal */}
      <ProfileDetailsCard
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        userData={selectedUserData}
      />
    </div>
  );
}
