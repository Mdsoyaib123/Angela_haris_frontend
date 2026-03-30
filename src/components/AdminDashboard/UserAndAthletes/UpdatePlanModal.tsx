import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserSubscriptionPlanMutation } from "@/redux/features/admin/adminAllUser/AdminAllUserApi";
import { useGetStripePlansQuery } from "@/redux/features/stripe/stripeApi";
import { PricingTier } from "@/redux/types/stripe.type";
import { toast } from "sonner";

interface UpdatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentPlan: string;
  userName: string;
}

// Helper to match current plan name to plan id
const findPlanIdByName = (plans: PricingTier[], planName: string): string => {
  const plan = plans.find(
    (p) => p.name.toUpperCase() === planName.toUpperCase(),
  );
  return plan ? plan.id : "";
};

export default function UpdatePlanModal({
  isOpen,
  onClose,
  userId,
  currentPlan,
  userName,
}: UpdatePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const { data: plansData, isLoading: isPlansLoading } =
    useGetStripePlansQuery();
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateUserSubscriptionPlanMutation();

  const plans = plansData?.data || [];

  useEffect(() => {
    if (isOpen && plans.length > 0) {
      const planId = findPlanIdByName(plans, currentPlan);
      setSelectedPlan(planId);
    }
  }, [currentPlan, isOpen, plans]);

  const handleConfirm = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    const currentPlanId = findPlanIdByName(plans, currentPlan);
    if (selectedPlan === currentPlanId) {
      toast.info("No change in plan selected");
      onClose();
      return;
    }

    try {
      await updatePlan({
        userId,
        planId: selectedPlan,
      }).unwrap();

      toast.success("Plan updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update plan");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-[#C6CAD1]">
          <h2 className="text-lg font-semibold text-gray-800">Update Plan</h2>
          <button
            onClick={onClose}
            className="text-[#28303F] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1 font-medium">User</p>
            <p className="font-bold text-gray-900 text-lg">{userName}</p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="subscriptionPlan"
              className="text-sm font-medium text-gray-700"
            >
              Subscription Plan
            </Label>
            <Select
              value={selectedPlan}
              onValueChange={setSelectedPlan}
              disabled={isPlansLoading}
            >
              <SelectTrigger
                id="subscriptionPlan"
                className="h-11 rounded-xl border-gray-200 focus:ring-green-500 cursor-pointer w-full"
              >
                <SelectValue
                  placeholder={
                    isPlansLoading ? "Loading plans..." : "Select plan"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white w-full">
                {plans.map((plan: PricingTier) => (
                  <SelectItem
                    key={plan.id}
                    value={plan.id}
                    className="cursor-pointer"
                  >
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 border-2 border-green-500 text-green-500 font-medium rounded-full hover:bg-green-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isUpdating || isPlansLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? "Updating..." : "Update Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
