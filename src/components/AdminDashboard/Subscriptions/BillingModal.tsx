// BillingModal.tsx
import React from "react";
import { X } from "lucide-react";
import { useGetTransactionByIdQuery } from "@/redux/features/stripe/stripeApi";
import { TransactionDetails } from "@/redux/types/stripe.type";

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

export function BillingModal({
  isOpen,
  onClose,
  transactionId,
}: BillingModalProps) {
  // Fetch data only if modal is open and we have an ID
  const { data, isLoading, error } = useGetTransactionByIdQuery(
    transactionId!,
    {
      skip: !isOpen || !transactionId,
    },
  );

  if (!isOpen) return null;

  // const handleIssueRefund = () => {
  //   alert("Refund process initiated");
  // };

  // const handleSwitchTier = () => {
  //   alert("Opening tier selection...");
  // };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Determine plan display name: if plan.name !== "Free" show "Premium", else "Free"
  const getPlanDisplayName = (planName: string) => {
    return planName !== "Free" ? "Premium" : "Free";
  };

  // Determine renewal/end text based on subscription status
  const getRenewalText = (subscription: TransactionDetails["subscription"]) => {
    if (subscription.status === "canceled" && subscription.endedAt) {
      return `Canceled on ${formatDate(subscription.endedAt)}`;
    }
    if (subscription.status === "active" && subscription.startedAt) {
      // For active subscriptions, maybe show next billing date? Not provided, so fallback to startedAt.
      return `Started on ${formatDate(subscription.startedAt)}`;
    }
    return "No active subscription";
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 mb-5 border-b border-[#C6CAD1]">
          <h2 className="text-lg font-semibold text-gray-800">
            Billing & Subscription Overview
          </h2>
          <button
            onClick={onClose}
            className="text-[#28303F] cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {isLoading && (
            <div className="text-center py-8">
              Loading transaction details...
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500">
              Failed to load transaction details.
            </div>
          )}
          {data && !isLoading && !error && (
            <>
              {/* Current Active Plan */}
              <div className="text-center space-y-4 rounded-2xl bg-[#EBF4FF] py-4">
                <p className="text-sm text-[#475569]">Current Active Plan</p>
                <h3 className="text-4xl font-medium text-blue-600">
                  {getPlanDisplayName(data.data.plan.name)}
                </h3>
                <p className="text-sm text-[#475569]">
                  {getRenewalText(data.data.subscription)}
                </p>
              </div>

              {/* Plan Entitlements */}
              <div className="space-y-4">
                <h4 className="font-normal text-[#475569] text-lg">
                  Plan Entitlements
                </h4>
                <div className="space-y-3 rounded-lg">
                  {/* Clip Generation - we can derive status from subscription */}
                  <div className="flex justify-between items-center p-3 border border-[#EDF1F3] rounded-2xl">
                    <span className="text-[#1A1C1E] text-base">
                      Clip Generation
                    </span>
                    <span className="font-medium text-gray-900">
                      {getPlanDisplayName(data.data.plan.name) === "Premium"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  {/* Monthly Cost */}
                  <div className="flex justify-between items-center p-3 border border-[#EDF1F3] rounded-2xl">
                    <span className="text-[#1A1C1E] text-base">
                      Monthly Cost
                    </span>
                    <span className="font-medium text-green-600">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: data.data.currency.toUpperCase(),
                      }).format(data.data.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-3">
                <h4 className="font-normal text-[#475569] text-lg">
                  Payment History
                </h4>
                <p className="text-xs text-[#6C7787] font-normal">
                  Last charge successful on {formatDate(data.data.billingDate)}.
                  {data.data.status === "succeeded"
                    ? " No issues detected."
                    : ` Status: ${data.data.status}.`}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        {/* <div className="flex gap-5 pt-6">
          <button
            onClick={handleIssueRefund}
            className="flex-1 cursor-pointer rounded-full border border-green-600 bg-transparent px-4 py-2 font-medium text-green-600 transition-colors hover:bg-green-50"
          >
            Issue Refund
          </button>
          <button
            onClick={handleSwitchTier}
            className="flex-1 cursor-pointer rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
          >
            Switch Tier
          </button>
        </div> */}
      </div>
    </div>
  );
}
