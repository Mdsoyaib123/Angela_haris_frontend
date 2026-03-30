import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useChangePasswordMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { validatePassword } from "@/utils/passwordValidation";

const ChangesPassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const validation = validatePassword(formData.newPassword);
      if (!validation.isValid) {
        newErrors.newPassword = "Password does not meet requirements";
      }
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      if (response.success) {
        toast.success("Password changed successfully!");
        // Clear form
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#EFEEEE]  p-3 sm:p-4 md:p-6 w-full">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Login & Security
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="oldPassword"
              className="text-sm text-muted-foreground"
            >
              Current Password
            </Label>
            <Input
              id="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={(e) => handleChange("oldPassword", e.target.value)}
              className={`w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 ${
                errors.oldPassword ? "border-red-500" : ""
              }`}
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.oldPassword}</p>
            )}
          </div>
        </div>

        {/* New Password & Confirm New Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* New Password */}
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm text-muted-foreground"
            >
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              className={`w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 ${
                errors.newPassword ? "border-red-500" : ""
              }`}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmNewPassword"
              className="text-sm text-muted-foreground"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={(e) =>
                handleChange("confirmNewPassword", e.target.value)
              }
              className={`w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 ${
                errors.confirmNewPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Password requirements:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                label: "At least 8 characters",
                met: validatePassword(formData.newPassword).hasMinLength,
              },
              {
                label: "At least one uppercase",
                met: validatePassword(formData.newPassword).hasUppercase,
              },
              {
                label: "At least one lowercase",
                met: validatePassword(formData.newPassword).hasLowercase,
              },
              {
                label: "At least one number",
                met: validatePassword(formData.newPassword).hasNumber,
              },
              {
                label: "One special character (@$!%*?&)",
                met: validatePassword(formData.newPassword).hasSpecialChar,
              },
            ].map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span
                  className={`text-xs ${req.met ? "text-green-600 font-medium" : "text-gray-500"}`}
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-6 px-4 py-5 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangesPassword;

// import { Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";

// const ChangesPassword = () => {
//   const [accountDetailsData, setAccountDetailsData] = useState({
//     parentName: "",
//     relationToAthlet: "",
//     email: "",
//     phone: "",
//     timeZone: "",
//     preferredLanguage: "",
//     notificationPreferences: "",
//     aauOrTeam: "",
//     contactName: "",
//     contactNumber: "",
//     contactEmail: "",
//   });

//   const [loginAndSecurityData, setLoginAndSecurityData] = useState({
//     password: "",
//     changePassword: "",
//     confirmNewPassword: "",
//   });

//   const handleLoginAndSecurityChange = (field: string, value: string) => {
//     setLoginAndSecurityData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleLoginAndSecuritySubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(
//       "Login and Security Data Form submitted:",
//       loginAndSecurityData,
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl border border-[#EFEEEE]  p-3 sm:p-4 md:p-6 w-full">
//       <h2 className="text-lg font-semibold text-foreground mb-6">
//         Login & Security
//       </h2>

//       <form onSubmit={handleLoginAndSecuritySubmit} className="space-y-6">
//         {/* Password */}
//         <div className="grid grid-cols-1 gap-4 sm:gap-6">
//           {/* Password */}
//           <div className="space-y-2">
//             <Label htmlFor="password" className="text-sm text-muted-foreground">
//               Password
//             </Label>
//             <Input
//               id="password"
//               value={loginAndSecurityData.password}
//               onChange={(e) =>
//                 handleLoginAndSecurityChange("password", e.target.value)
//               }
//               className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//             />
//           </div>
//         </div>

//         {/* Change Password & Confirm New Password */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//           {/* Change Password */}
//           <div className="space-y-2">
//             <Label
//               htmlFor="changePassword"
//               className="text-sm text-muted-foreground"
//             >
//               Change Password
//             </Label>
//             <Input
//               id="changePassword"
//               value={loginAndSecurityData.changePassword}
//               type="changePassword"
//               onChange={(e) =>
//                 handleLoginAndSecurityChange("changePassword", e.target.value)
//               }
//               className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//             />
//           </div>
//           {/* Confirm New Password */}
//           <div className="space-y-2">
//             <Label
//               htmlFor="confirmNewPassword"
//               className="text-sm text-muted-foreground"
//             >
//               Confirm New Password
//             </Label>
//             <Input
//               id="confirmNewPassword"
//               value={loginAndSecurityData.confirmNewPassword}
//               onChange={(e) =>
//                 handleLoginAndSecurityChange(
//                   "confirmNewPassword",
//                   e.target.value,
//                 )
//               }
//               className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="pt-4">
//           <Button
//             type="submit"
//             className="mt-6 px-4 py-5 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
//           >
//             <Save className="w-4 h-4" />
//             Save Changes
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChangesPassword;
