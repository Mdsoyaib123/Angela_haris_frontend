import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function OnboardingSuccessPage() {
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("account_id");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-green-100">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 text-green-600 rounded-full p-4">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">
          Onboarding Successful!
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Your Stripe account has been connected successfully. You can now start
          receiving payments.
        </p>

        {/* Simple Status */}
        {accountId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Account ID</p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {accountId}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Link to="/admin-dashboard">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group">
            Go to Dashboard
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </Link>

        {/* Optional note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          You can manage your payment settings anytime from your dashboard
        </p>
      </div>
    </div>
  );
}
