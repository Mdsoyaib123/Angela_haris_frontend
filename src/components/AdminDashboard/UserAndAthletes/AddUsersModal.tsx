// src/components/admin/users/AddUsersModal.tsx

import { Eye, EyeOff, X } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/utils/passwordValidation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddUserMutation } from "@/redux/features/admin/adminAllUser/AdminAllUserApi";
import { useGetStripePlansQuery } from "@/redux/features/stripe/stripeApi";
import {
  AddUserRequest,
  UserRole,
  SubscribeStatus,
} from "@/redux/types/AdminAllUserType";
import { toast } from "sonner";

interface AddUsersModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Helper functions to get display names
const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.ATHLATE:
      return "Athlete";
    case UserRole.PARENT:
      return "Parent";
    default:
      return role;
  }
};

const getPlanDisplayName = (plan: SubscribeStatus): string => {
  switch (plan) {
    case SubscribeStatus.ELITE:
      return "Elite";
    case SubscribeStatus.PRO:
      return "Pro";
    case SubscribeStatus.FREE:
      return "Free";
    default:
      return plan;
  }
};

export default function AddUsersModal({
  isOpen = false,
  onClose,
}: AddUsersModalProps) {
  const [formData, setFormData] = useState<AddUserRequest>({
    athleteFullName: "",
    email: "",
    systemRole: UserRole.ATHLATE,
    subscriptionPlan: SubscribeStatus.FREE,
    password: "",
    planId: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [addUser, { isLoading }] = useAddUserMutation();
  const {
    data: plansData,
    isLoading: plansLoading,
    isError: plansError,
  } = useGetStripePlansQuery();

  // Debug: log the fetched plans
  useEffect(() => {
    if (plansData?.data) {
      console.log("Fetched plans:", plansData.data);
    }
  }, [plansData]);

  // Create a mapping from subscription plan enum to stripe price id
  const planIdMap = useMemo(() => {
    const map: Record<SubscribeStatus, string> = {
      [SubscribeStatus.ELITE]: "",
      [SubscribeStatus.PRO]: "",
      [SubscribeStatus.FREE]: "",
    };

    if (plansData?.data) {
      plansData.data.forEach((plan) => {
        const planName = plan.name.toLowerCase().trim();
        // Match plan names that contain the tier name (case‑insensitive)
        // You can adjust these conditions to match your actual plan names
        if (planName.includes("annually")) {
          map[SubscribeStatus.ELITE] = plan.id;
        } else if (planName.includes("monthly")) {
          map[SubscribeStatus.PRO] = plan.id;
        } else if (planName.includes("free")) {
          map[SubscribeStatus.FREE] = plan.id;
        }
      });
    }

    console.log("Plan ID Map:", map);
    return map;
  }, [plansData]);

  // When plans load, set the planId for the default subscription plan
  useEffect(() => {
    if (!plansLoading && planIdMap[SubscribeStatus.FREE]) {
      setFormData((prev) => ({
        ...prev,
        planId: planIdMap[SubscribeStatus.FREE],
      }));
    }
  }, [plansLoading, planIdMap]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSystemRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, systemRole: value }));
  };

  const handleSubscriptionPlanChange = (value: SubscribeStatus) => {
    const planId = planIdMap[value];
    console.log(`Selected plan: ${value}, planId: ${planId}`);

    if (!planId) {
      toast.warning(
        `No plan ID found for ${value}. Please check the plan names in the API.`,
      );
    }

    setFormData((prev) => ({
      ...prev,
      subscriptionPlan: value,
      planId: planId || "",
    }));
  };

  const handleConfirm = async () => {
    // Validate form
    if (!formData.athleteFullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      toast.error(PASSWORD_VALIDATION_MESSAGE);
      return;
    }
    if (!formData.planId) {
      toast.error("Plan ID is missing. Please select a subscription plan.");
      return;
    }

    console.log("Submitting form data:", formData);

    try {
      const result = await addUser(formData).unwrap();
      console.log("Add user success:", result);

      if (result.success) {
        toast.success(result.message || "User created successfully");
        // Reset form to default values
        setFormData({
          athleteFullName: "",
          email: "",
          systemRole: UserRole.ATHLATE,
          subscriptionPlan: SubscribeStatus.FREE,
          password: "",
          planId: planIdMap[SubscribeStatus.FREE] || "",
        });
        onClose?.();
      }
    } catch (error: any) {
      console.error("Add user error:", error);
      console.error("Error response:", error.data);

      if (error.data?.message) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create user");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      athleteFullName: "",
      email: "",
      systemRole: UserRole.ATHLATE,
      subscriptionPlan: SubscribeStatus.FREE,
      password: "",
      planId: planIdMap[SubscribeStatus.FREE] || "",
    });
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleCancel}
      />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between
                        bg-gray-50 px-6 pt-6 pb-4 border-b border-[#C6CAD1]"
        >
          <h2 className="text-lg font-semibold text-gray-800">Add Users</h2>
          <button
            onClick={handleCancel}
            className="text-[#28303F] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="athleteFullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="athleteFullName"
              name="athleteFullName"
              value={formData.athleteFullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* System Role */}
          <div className="space-y-2">
            <Label htmlFor="systemRole">
              System Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.systemRole}
              onValueChange={(value) =>
                handleSystemRoleChange(value as UserRole)
              }
            >
              <SelectTrigger
                id="systemRole"
                className="w-full bg-background h-11 rounded-xl border-gray-200 focus:ring-green-500 cursor-pointer"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.values(UserRole).map((role) => (
                  <SelectItem
                    key={role}
                    className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                    value={role}
                  >
                    {getRoleDisplayName(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Plan */}
          <div className="space-y-2">
            <Label htmlFor="subscriptionPlan">
              Subscription Plan <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.subscriptionPlan}
              onValueChange={(value) =>
                handleSubscriptionPlanChange(value as SubscribeStatus)
              }
              disabled={plansLoading}
            >
              <SelectTrigger
                id="subscriptionPlan"
                className="w-full bg-background h-11 rounded-xl border-gray-200 focus:ring-green-500 cursor-pointer"
              >
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.values(SubscribeStatus).map((plan) => (
                  <SelectItem
                    key={plan}
                    className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                    value={plan}
                  >
                    {getPlanDisplayName(plan)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {plansLoading && (
              <p className="text-xs text-gray-500">Loading plans...</p>
            )}
            {plansError && (
              <p className="text-xs text-red-500">
                Failed to load plans. Please refresh.
              </p>
            )}
          </div>
        </div>

        {/* Footer with Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border-2 border-green-500 text-green-500 font-medium rounded-full hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || plansLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Confirm and Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
