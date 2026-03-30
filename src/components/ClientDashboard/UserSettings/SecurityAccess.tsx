import { toast } from "sonner";
import {
  useAuthMeQuery,
  useUpdateTwoStepVerificationStatusMutation,
} from "@/redux/features/auth/authApi";
import { Loader2 } from "lucide-react";

export default function SecurityAccess() {
  const { data: userData, isLoading: isUserLoading } = useAuthMeQuery();
  const [updateTwoStep, { isLoading: isUpdating }] =
    useUpdateTwoStepVerificationStatusMutation();

  const user = userData?.data?.user;
  const twoFactorEnabled = user?.isTwoStepVerification ?? false;

  const handleToggle = async () => {
    if (!user?.id) return;

    try {
      const response = await updateTwoStep({
        userId: user.id,
        isTwoStepVerification: !twoFactorEnabled,
      }).unwrap();

      if (response.success) {
        toast.success(
          `Two-step verification ${!twoFactorEnabled ? "enabled" : "disabled"} successfully`,
        );
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update two-step verification",
      );
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center p-6 bg-white rounded-xl border border-[#EFEEEE]">
        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-xl border border-[#EFEEEE] sm:p-4 md:p-6">
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Two-Step Verification
      </h2>

      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Two-Factor Authentication
          </p>
          <p className="text-xs text-gray-500">
            Add an extra layer of security to your account
          </p>
        </div>

        <button
          role="switch"
          aria-checked={twoFactorEnabled}
          disabled={isUpdating}
          onClick={handleToggle}
          className={`
            relative inline-flex items-center
            h-6 w-11 rounded-full
            transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer
            ${twoFactorEnabled ? "bg-green-500" : "bg-gray-300"}
            ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {isUpdating ? (
            <Loader2 className="absolute left-1 w-4 h-4 animate-spin text-white z-10" />
          ) : null}
          <span
            className={`
              inline-block h-4 w-4 rounded-full
              bg-white shadow-md
              transition-transform duration-300 ease-out
              ${twoFactorEnabled ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
      </div>
    </div>
  );
}
