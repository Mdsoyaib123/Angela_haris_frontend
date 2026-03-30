import { X, DollarSign, Loader2, Landmark } from "lucide-react";
import { useState } from "react";
import { useTransferCommissionMutation } from "@/redux/features/organization/organizationApi";
import { toast } from "sonner";

interface TransferCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgData: any;
}

export default function TransferCommissionModal({
  isOpen = false,
  onClose,
  orgData,
}: TransferCommissionModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");

  const [transferCommission, { isLoading }] = useTransferCommissionMutation();

  if (!isOpen || !orgData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (transferAmount > Number(orgData.commissionBalance || 0)) {
      toast.error("Amount exceeds available commission balance.");
      return;
    }

    try {
      await transferCommission({
        organizationId: orgData.id,
        amount: transferAmount,
        currency: currency.toLowerCase(),
      }).unwrap();

      toast.success("Commission transferred successfully!");
      handleClose();
    } catch (err: any) {
      const message =
        err?.data?.message ??
        "Failed to transfer commission. Please try again.";
      toast.error(message);
    }
  };

  const handleClose = () => {
    setAmount("");
    setCurrency("usd");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <DollarSign className="text-green-600 w-6 h-6" />
              Transfer Commission
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              To: {orgData.organizationName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Balance Info Card */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-green-700 tracking-wider">
                Withdrawable Balance
              </p>
              <p className="text-2xl font-black text-green-800">
                ${parseFloat(orgData?.commissionBalance || 0).toFixed(2)}
              </p>
            </div>
            <Landmark className="text-green-200 w-10 h-10" />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-widest pl-1">
              Transfer Amount
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-gray-800 focus:outline-none focus:border-green-500 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Currency (Hidden or Display only for now if restricted to USD) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-widest pl-1">
              Currency
            </label>
            <select
              value={currency}
              disabled
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="usd">USD - US Dollar</option>
            </select>
          </div>

          {/* Warning Note */}
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex gap-3">
            <p className="flex-1 text-[11px] font-medium text-amber-700 leading-relaxed">
              Funds will be sent to the organization’s Stripe account. This
              cannot be undone.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full rounded-xl bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] px-4 py-4 font-bold text-white shadow-lg shadow-green-100 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm & Transfer Funds"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
