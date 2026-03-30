import {
  useCurrentPlanQuery,
  // useGetStripePlansQuery,
  // useCreateStripeCheckoutSessionMutation,
} from "@/redux/features/stripe/stripeApi";
import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2"; // <-- Import SweetAlert2

export default function SubscriptionCard() {
  const { data, isLoading, isError } = useCurrentPlanQuery();
  // const { data: plansData } = useGetStripePlansQuery();
  // const [createCheckoutSession, { isLoading: checkoutLoading }] =
  //   useCreateStripeCheckoutSessionMutation();
  // console.log(data?.data.plan.price);

  // Local state for auto‑renewal (static UI only)
  const [autoRenew, setAutoRenew] = useState(true);

  // const targetPlan = plansData?.data?.find(
  //   (p) => p.price === data?.data?.plan?.price,
  // );
  // const targetPriceId = targetPlan?.stripePriceId;
  // const is99 = data?.data.plan.price === 99;
  // console.log(is99);

  if (isLoading) {
    return <SubscriptionCardSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-red-50 p-6 sm:p-8 w-full shadow-lg">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-600 font-medium mb-4">
            Failed to load subscription details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const plan = data?.data;
  const hasSubscription = !!plan;

  // const handleUpgrade = async () => {
  //   if (!targetPriceId) return;
  //   try {
  //     const res = await createCheckoutSession({
  //       priceId: targetPriceId,
  //     }).unwrap();
  //     if (res.success) {
  //       window.location.href = res.url;
  //     }
  //   } catch (error) {
  //     console.error("Upgrade failed:", error);
  //   }
  // };

  // SweetAlert confirmation before toggling auto-renewal
  const handleAutoRenewToggle = async () => {
    const newState = !autoRenew;
    // const action = newState ? "enable" : "disable";

    const result = await Swal.fire({
      title: newState ? "Enable auto‑renewal?" : "Disable auto‑renewal?",
      text: newState
        ? "Your subscription will automatically renew at the end of the current period."
        : "Your subscription will expire after the current period and you may lose access to premium features.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00A849",
      cancelButtonColor: "#d33",
      confirmButtonText: newState ? "Yes, enable" : "Yes, disable",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setAutoRenew(newState);
      // Optional: show success message
      Swal.fire({
        title: "Updated!",
        text: newState
          ? "Auto‑renewal has been enabled."
          : "Auto‑renewal has been disabled.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="rounded-3xl bg-green-50 p-4 sm:p-6 md:p-10 w-full shadow border border-green-100">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-green-100 gap-4 md:gap-6">
        <div className="text-center md:text-left">
          <p className="text-gray-600 text-sm sm:text-base font-normal mb-1">
            Current Plan
          </p>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            {hasSubscription ? (
              <>
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  ${plan.plan.price}
                </span>
                <span className="text-gray-600 text-base sm:text-lg font-medium">
                  {plan.plan.name === "Annually" ? "/year" : "/month"}
                </span>
              </>
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-400">
                No active plan
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasSubscription ? (
            <span
              className={`text-xs sm:text-sm font-bold px-5 py-2 rounded-full shadow-sm w-full sm:w-auto text-center ${
                plan.status === "active"
                  ? "bg-green-600 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {plan.status === "active" ? "Active" : "Inactive"}
            </span>
          ) : (
            <span className="bg-gray-200 text-gray-600 text-xs sm:text-sm font-bold px-5 py-2 rounded-full w-full sm:w-auto text-center border border-gray-300">
              No subscription
            </span>
          )}

          {hasSubscription && data.data.plan.price < 99 && (
            <Link
              to="/user-dashboard/subscription"
              className="text-sm sm:text-base font-medium text-white py-2 px-6 sm:px-8 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer w-full sm:w-auto text-center"
            >
              Choose a Plan
            </Link>
          )}
        </div>
      </div>

      {/* Grid for Billing info and Auto-renew */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-10 text-center sm:text-left">
        <div className="p-3 sm:p-0 bg-white/40 sm:bg-transparent rounded-2xl sm:rounded-none border border-green-100/50 sm:border-none">
          <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider font-semibold mb-1 sm:mb-2">
            BILLING CYCLE
          </p>
          <p className="text-gray-900 font-bold text-base sm:text-lg md:text-xl">
            {hasSubscription ? plan.plan.name : "—"}
          </p>
        </div>

        <div className="p-3 sm:p-0 bg-white/40 sm:bg-transparent rounded-2xl sm:rounded-none border border-green-100/50 sm:border-none">
          <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider font-semibold mb-1 sm:mb-2">
            BILLING DATE
          </p>
          <p className="text-gray-900 font-bold text-base sm:text-lg md:text-xl">
            {plan?.startedAt
              ? new Date(plan.startedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </p>
        </div>

        {hasSubscription && (
          <div className="flex flex-col sm:col-span-2 md:col-span-1 p-3 sm:p-0 bg-white/40 sm:bg-transparent rounded-2xl sm:rounded-none border border-green-100/50 sm:border-none">
            <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider font-semibold mb-1 sm:mb-2">
              AUTO-RENEWAL
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={autoRenew}
                onClick={handleAutoRenewToggle}
                className={`
                  relative inline-flex items-center h-6 w-11 rounded-full
                  transition-colors duration-300 focus:outline-none focus:ring-2
                  focus:ring-green-500/40 cursor-pointer
                  ${autoRenew ? "bg-green-500" : "bg-gray-300"}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-md
                    transition-transform duration-300 ease-out
                    ${autoRenew ? "translate-x-6" : "translate-x-1"}
                  `}
                />
              </button>
              <span
                className={`text-sm font-medium ${autoRenew ? "text-green-700" : "text-gray-500"}`}
              >
                {autoRenew ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        )}
      </div>

      {!hasSubscription && (
        <Link
          to="/user-dashboard/subscription"
          className="block sm:inline-block text-sm sm:text-base font-medium text-white py-3 px-8 sm:px-10 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer text-center w-full sm:w-auto"
        >
          Choose a Plan
        </Link>
      )}
    </div>
  );
}

function SubscriptionCardSkeleton() {
  return (
    <div className="rounded-3xl bg-green-50 p-6 sm:p-8 w-full shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
          <div className="h-8 w-40 bg-gray-300 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
      </div>

      {/* Info */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6 px-2">
        <div>
          <div className="h-3 w-28 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
        <div>
          <div className="h-3 w-36 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-28 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Auto‑renew skeleton */}
      <div className="border-t border-green-100 pt-6 mb-6 px-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="h-3 w-7 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 w-full bg-gray-300 rounded-full"></div>
        <div className="h-10 w-full bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
