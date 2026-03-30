import { useForgetResetPasswordMutation } from "@/redux/features/auth/authApi";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [resetPassword, { isLoading, error }] =
    useForgetResetPasswordMutation();

  // Redirect if no email (user landed directly)
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      await resetPassword({ email, newPassword: password }).unwrap();
      // Redirect to login with success message
      navigate("/login", {
        state: { message: "Password reset successful. Please log in." },
      });
    } catch (err) {
      console.error("Reset password failed:", err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password for{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password*
            </label>
            <div className="mt-1.5">
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password*
            </label>
            <div className="mt-1.5">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Error */}
          {passwordError && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {passwordError}
            </div>
          )}

          {/* API Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              Something went wrong. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 py-3 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
