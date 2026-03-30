import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { LuCircleCheckBig } from "react-icons/lu";
import {
  useCreateStripeCheckoutSessionMutation,
  useCurrentPlanQuery,
  useGetStripePlansQuery,
} from "@/redux/features/stripe/stripeApi";
import { PricingTier } from "@/redux/types/stripe.type";

/* ===============================
   Skeleton Component
================================= */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
}

/* ===============================
   Billing Toggle (Default to Annually)
================================= */
function BillingToggle({
  billingPeriod,
  setBillingPeriod,
}: {
  billingPeriod: "month" | "year";
  setBillingPeriod: (period: "month" | "year") => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={cn(
          "text-sm font-medium cursor-pointer transition-colors",
          billingPeriod === "month" ? "text-gray-800" : "text-gray-400",
        )}
        onClick={() => setBillingPeriod("month")}
      >
        Monthly
      </span>

      <button
        onClick={() =>
          setBillingPeriod(billingPeriod === "month" ? "year" : "month")
        }
        className={cn(
          "relative inline-flex items-center h-3 w-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer",
          billingPeriod === "year" ? "bg-green-500" : "bg-gray-300",
        )}
      >
        <span
          className={cn(
            "absolute left-0 h-5 w-5 rounded-full bg-[#00A849] shadow-md transition-transform duration-300 ease-out",
            billingPeriod === "year" ? "translate-x-4" : "-translate-x-2",
          )}
        />
      </button>

      <span
        className={cn(
          "text-sm font-medium cursor-pointer transition-colors",
          billingPeriod === "year" ? "text-gray-800" : "text-gray-400",
        )}
        onClick={() => setBillingPeriod("year")}
      >
        Annually
      </span>
    </div>
  );
}

/* ===============================
   Pricing Card
================================= */
export default function PricingCard() {
  const { data, isLoading } = useGetStripePlansQuery();
  const { data: currentPlan } = useCurrentPlanQuery();
  const [createStripeCheckoutSession, { isLoading: checkOutLoading }] =
    useCreateStripeCheckoutSessionMutation();
  console.log(currentPlan);

  // Default to "year" (Annually) as requested
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("year");
  // const [promoCode, setPromoCode] = useState("");
  // const [showPromoInput, setShowPromoInput] = useState(false);

  /* Derived Data */
  const showData: PricingTier | undefined = useMemo(() => {
    return data?.data?.find((tier) => tier.interval === billingPeriod);
  }, [data, billingPeriod]);

  const handlePurchase = async () => {
    if (!showData) return;
    try {
      const res = await createStripeCheckoutSession({
        priceId: showData.stripePriceId!,
      }).unwrap();

      if (res.success) {
        window.location.href = res.url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleApplyPromo = () => {
  //   // Here you would validate the promo code
  //   // For now, we'll just close the input
  //   setShowPromoInput(false);
  //   // You might want to show a success message or handle the free plan logic
  //   console.log("Promo code applied:", promoCode);
  // };

  return (
    <div className="w-full bg-[#E6F6ED] rounded-2xl p-6 shadow-sm border border-[#B0E4C7]">
      {/* Title - Changed to "Highlightz Advantage" */}
      <h2 className="text-[#0F1325] font-semibold text-center text-3xl mb-4">
        Pro Tier
      </h2>

      {/* ================= PRICE ================= */}
      <div className="text-center py-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-4 w-24 rounded-lg" />
          </div>
        ) : (
          <p className="text-6xl font-medium text-gray-900 mb-3">
            ${showData?.price}
            {/* Removed the "/billingPeriod" text as requested */}
            {showData?.price === 99 && (
              <span className="text-2xl line-through text-gray-500 ml-4">
                $119
              </span>
            )}
          </p>
        )}

        <BillingToggle
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        />
      </div>

      {/* ================= PROMO CODE ================= */}
      {/* <div className="mb-4">
        {!showPromoInput ? (
          <button
            onClick={() => setShowPromoInput(true)}
            className="text-sm text-[#2EBC03] hover:underline focus:outline-none"
          >
            + Add promotion code
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 px-3 py-2 text-sm border border-[#B0E4C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/40"
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 py-2 text-sm text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] rounded-lg hover:brightness-110 transition-all"
            >
              Apply
            </button>
            <button
              onClick={() => setShowPromoInput(false)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}
      </div> */}

      {/* ================= FEATURES ================= */}
      <div className="space-y-3 border-t border-emerald-100 pt-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-full max-w-55" />
              </div>
            ))
          : showData?.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <LuCircleCheckBig
                  className="w-5 h-5 text-green-600"
                  strokeWidth={3}
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
        {/* Add "Share and Track Recruiting Progress" feature */}
        {/* <div className="flex items-center gap-3">
          <LuCircleCheckBig
            className="w-5 h-5 text-green-600"
            strokeWidth={3}
          />
          <span className="text-sm text-gray-700">
            Share and Track Recruiting Progress
          </span>
        </div> */}
      </div>

      {/* ================= BUTTON ================= */}
      {isLoading ? (
        <Skeleton className="mt-6 h-12 w-full rounded-full" />
      ) : (
        showData &&
        (!currentPlan?.data ||
          (currentPlan?.data?.plan?.price === 9.99 &&
            showData.price === 99)) && (
          <button
            onClick={handlePurchase}
            disabled={checkOutLoading || !showData}
            className="w-full mt-6 py-3 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] disabled:bg-green-700 shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkOutLoading ? "Purchasing..." : "Purchase Now"}
          </button>
        )
      )}
    </div>
  );
}

// import { useState, useMemo } from "react";
// import { cn } from "@/lib/utils";
// import { LuCircleCheckBig } from "react-icons/lu";
// import {
//   useCreateStripeCheckoutSessionMutation,
//   useGetStripePlansQuery,
// } from "@/redux/features/stripe/stripeApi";
// import { PricingTier } from "@/redux/types/stripe.type";

// /* ===============================
//    Skeleton Component
// ================================= */
// function Skeleton({ className = "" }: { className?: string }) {
//   return (
//     <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
//   );
// }

// /* ===============================
//    Billing Toggle (UI Only)
// ================================= */
// function BillingToggle({
//   billingPeriod,
//   setBillingPeriod,
// }: {
//   billingPeriod: "month" | "year";
//   setBillingPeriod: (period: "month" | "year") => void;
// }) {
//   return (
//     <div className="flex items-center justify-center gap-3">
//       <span
//         className={cn(
//           "text-sm font-medium cursor-pointer transition-colors",
//           billingPeriod === "month" ? "text-gray-800" : "text-gray-400",
//         )}
//         onClick={() => setBillingPeriod("month")}
//       >
//         Monthly
//       </span>

//       <button
//         onClick={() =>
//           setBillingPeriod(billingPeriod === "month" ? "year" : "month")
//         }
//         className={cn(
//           "relative inline-flex items-center h-3 w-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer",
//           billingPeriod === "year" ? "bg-green-500" : "bg-gray-300",
//         )}
//       >
//         <span
//           className={cn(
//             "absolute left-0 h-5 w-5 rounded-full bg-[#00A849] shadow-md transition-transform duration-300 ease-out",
//             billingPeriod === "year" ? "translate-x-4" : "-translate-x-2",
//           )}
//         />
//       </button>

//       <span
//         className={cn(
//           "text-sm font-medium cursor-pointer transition-colors",
//           billingPeriod === "year" ? "text-gray-800" : "text-gray-400",
//         )}
//         onClick={() => setBillingPeriod("year")}
//       >
//         Annually
//       </span>
//     </div>
//   );
// }

// /* ===============================
//    Pricing Card
// ================================= */
// export default function PricingCard() {
//   const { data, isLoading } = useGetStripePlansQuery();
//   const [createStripeCheckoutSession, { isLoading: checkOutLoading }] =
//     useCreateStripeCheckoutSessionMutation();

//   const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");

//   /* Derived Data */
//   const showData: PricingTier | undefined = useMemo(() => {
//     return data?.data?.find((tier) => tier.interval === billingPeriod);
//   }, [data, billingPeriod]);

//   const handlePurchase = async () => {
//     if (!showData) return;
//     try {
//       const res = await createStripeCheckoutSession({
//         priceId: showData.stripePriceId!,
//       }).unwrap();

//       if (res.success) {
//         window.location.href = res.url;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="w-full bg-[#E6F6ED] rounded-2xl p-6 shadow-sm border border-[#B0E4C7]">
//       {/* ================= PRICE ================= */}
//       <div className="text-center py-6">
//         {isLoading ? (
//           <div className="flex flex-col items-center gap-4">
//             <Skeleton className="h-12 w-40 rounded-xl" />
//             <Skeleton className="h-4 w-24 rounded-lg" />
//           </div>
//         ) : (
//           <p className="text-6xl font-medium text-gray-900 mb-3">
//             ${showData?.price}
//             {/* <span className="text-lg font-normal text-gray-600">
//               /{billingPeriod}
//             </span> */}
//           </p>
//         )}

//         <BillingToggle
//           billingPeriod={billingPeriod}
//           setBillingPeriod={setBillingPeriod}
//         />
//       </div>

//       {/* ================= FEATURES ================= */}
//       <div className="space-y-3 border-t border-emerald-100 pt-4">
//         {isLoading
//           ? Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="flex items-center gap-3">
//                 <Skeleton className="h-5 w-5 rounded-full" />
//                 <Skeleton className="h-4 w-full max-w-55" />
//               </div>
//             ))
//           : showData?.features?.map((feature, index) => (
//               <div key={index} className="flex items-center gap-3">
//                 <LuCircleCheckBig
//                   className="w-5 h-5 text-green-600"
//                   strokeWidth={3}
//                 />
//                 <span className="text-sm text-gray-700">{feature}</span>
//               </div>
//             ))}
//       </div>

//       {/* ================= BUTTON ================= */}
//       {isLoading ? (
//         <Skeleton className="mt-6 h-12 w-full rounded-full" />
//       ) : (
//         <button
//           onClick={handlePurchase}
//           disabled={checkOutLoading || !showData}
//           className="w-full mt-6 py-3 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] disabled:bg-green-700 shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {checkOutLoading ? "Purchasing..." : "Purchase Now"}
//         </button>
//       )}
//     </div>
//   );
// }
