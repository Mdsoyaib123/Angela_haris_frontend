import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authApi";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OtpVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [
    verifyOtp,
    { isLoading: isVerifying, isSuccess: isVerified, error: verifyError },
  ] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResending }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, code: otp }).unwrap();
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await forgotPassword({ email }).unwrap();
      setCanResend(false);
      setTimer(60);
    } catch (err) {
      console.error("Resend failed:", err);
    }
  };

  if (isVerified) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-xl text-center">
          <div className="rounded-lg bg-green-50 p-6 text-green-700">
            <h2 className="text-xl font-semibold">
              OTP Verified Successfully!
            </h2>
            <p className="mt-2">You can now reset your password.</p>
            <button
              onClick={() => navigate("/reset-password", { state: { email } })}
              className="mt-4 inline-block rounded-full bg-green-600 px-6 py-2 text-white hover:bg-green-700"
            >
              Proceed to Reset Password
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify OTP</h1>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 4-digit code to{" "}
            <span className="font-medium">{email}</span>. Enter it below.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code*
            </label>
            <div className="mt-1.5">
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Enter 4-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                disabled={isVerifying}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 disabled:opacity-50"
              />
            </div>
          </div>

          {verifyError && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              Invalid or expired code. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 4}
            className="w-full bg-green-600 py-3 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            ) : (
              <span className="text-gray-400">
                Resend available in {timer}s
              </span>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
