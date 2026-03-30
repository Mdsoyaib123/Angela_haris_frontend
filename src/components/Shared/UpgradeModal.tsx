import { Crown, Sparkles, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
}

const UpgradeModal = ({
  isOpen,
  onClose,
  title = "Unlock Your Full Potential",
  description = "Generate your unique recruitment link and connect directly with elite college coaches today.",
  cancelText = "Maybe Later",
}: UpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop with intense blur */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-[2px] animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out border border-white/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-all duration-300"
        >
          <X size={20} />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Premium Header Header */}
        <div className="relative h-48 flex items-center justify-center overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#11D000_0%,#0C5302_100%)]">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.4),transparent_50%)]" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.4),transparent_50%)]" />
          </div>

          {/* Floating Icon Container */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 mb-4 animate-bounce-slow">
              <Crown size={40} className="text-white fill-white/20" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative px-8 pt-6 pb-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-green-100 mb-2">
              <Sparkles size={12} className="animate-pulse" />
              Exclusive Pro Feature
            </div>

            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight whitespace-pre-line">
              {title}
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
              {description}
            </p>

            <div className="w-full pt-6 space-y-4">
              <Link
                to="/user-dashboard/subscription"
                onClick={onClose}
                className="group relative w-full h-14 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <span className="relative z-10">Upgrade to Pro</span>
                <ChevronRight
                  size={18}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <button
                onClick={onClose}
                className="w-full h-12 bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all duration-300 active:scale-95"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
