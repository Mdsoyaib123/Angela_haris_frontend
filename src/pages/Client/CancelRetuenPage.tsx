import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function CancelRetuenPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 lg:p-0">
      <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl shadow-xl p-14 text-center max-w-xl w-full transform transition-all hover:scale-105 duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center  shadow-sm">
            <X strokeWidth={2.5} size={50} className="text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-green-800 mb-3">
          Payment Cancelled!
        </h1>

        <p className="text-gray-700 mb-3 text-sm">
          Your payment has been cancelled.
        </p>

        <Link
          to="/user-dashboard"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
