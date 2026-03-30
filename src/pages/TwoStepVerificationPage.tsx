import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyTwoStepVerificationMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";

const TwoStepVerificationPage: React.FC = () => {
  const [code, setCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [verify, { isLoading }] = useVerifyTwoStepVerificationMutation();

  const userId = location.state?.userId;
  const from = location.state?.from || "/user-dashboard";

  if (!userId) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      toast.error("Please enter a valid verification code.");
      return;
    }

    try {
      const response = await verify({ userId, code }).unwrap();

      if (response.success) {
        toast.success("Verification successful!");

        // Securely store tokens and user state
        dispatch(
          setUser({
            user: response.data.user,
            token: response.data.access_token,
            refreshToken: response.data.refresh_token,
          }),
        );

        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Verification failed:", err);
      toast.error(
        err?.data?.message ||
          err?.error ||
          "Verification failed. Please try again.",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Two-Step Verification
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the code sent to your email to verify your identity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <div className="mt-1.5">
              <input
                id="code"
                type="text"
                autoFocus
                placeholder="Enter 4-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-2xl tracking-widest font-bold text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 py-3 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default TwoStepVerificationPage;
