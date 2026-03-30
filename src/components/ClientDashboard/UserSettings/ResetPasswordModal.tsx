import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  validatePassword,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/utils/passwordValidation";
import { toast } from "sonner";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!PASSWORD_REGEX.test(password)) {
      toast.error(PASSWORD_VALIDATION_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Handle password reset logic here
    console.log("Password reset submitted");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with glass blur effect */}
      <div
        className="fixed inset-0 z-40 bg-white/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="pointer-events-auto w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Reset Password?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please enter a new password & confirm to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <p className="text-[10px] font-medium text-gray-700">
                Password requirements:
              </p>
              <div className="grid grid-cols-1 gap-1">
                {[
                  {
                    label: "At least 8 characters",
                    met: validatePassword(password).hasMinLength,
                  },
                  {
                    label: "Uppercase & Lowercase",
                    met:
                      validatePassword(password).hasUppercase &&
                      validatePassword(password).hasLowercase,
                  },
                  {
                    label: "One number",
                    met: validatePassword(password).hasNumber,
                  },
                  {
                    label: "One special char",
                    met: validatePassword(password).hasSpecialChar,
                  },
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-1 h-1 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span
                      className={`text-[9px] ${req.met ? "text-green-600" : "text-gray-500"}`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
