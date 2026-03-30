import { Link } from "react-router-dom";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl shadow-xl p-14 text-center max-w-xl w-full transform transition-all hover:scale-105 duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center  shadow-sm">
            <svg
              className="w-12 h-12 text-green-600 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-green-800 mb-3">
          Payment Successful!
        </h1>

        <p className="text-gray-700 mb-3 text-sm">
          Thank you for your purchase. Your payment has been completed
          successfully.
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
