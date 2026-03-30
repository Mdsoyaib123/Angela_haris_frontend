import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

interface AdjustAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgData?: any;
}

export default function AdjustAccessModal({
  isOpen = false,
  onClose,
  orgData,
}: AdjustAccessModalProps) {
  const [status, setStatus] = useState("Active Access");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const statuses = ["Active Access", "Inactive Access", "Pending Review"];

  // Calculate dropdown position whenever it opens
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom, left: rect.left, width: rect.width });
    }
  }, [isDropdownOpen]);

  if (!isOpen || !orgData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg rounded-xl bg-gray-50 max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between
                        bg-gray-50 px-6 pt-6 pb-4 border-b border-[#C6CAD1]"
        >
          <h2 className="text-lg font-bold text-gray-800">
            Access Configuration
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto overscroll-contain flex-1 space-y-6">
          {/* Subscriber / Organization */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Organization
            </h4>
            <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800">
                {orgData.organizationName}
              </p>
              <p className="text-xs text-gray-400 mt-1">{orgData.email}</p>
            </div>
          </div>

          {/* Override URL / Access Link */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Access Link
            </h4>
            <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
              <p className="text-sm text-gray-600 break-all leading-relaxed">
                {orgData.accessUrl.replace(/^https:\/\//, "") ||
                  "No link generated"}
              </p>
            </div>
          </div>

          {/* Expiration (Mocked for now as per original) */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Expiration Date
            </h4>
            <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                {orgData.createdAt
                  ? new Date(
                      new Date(orgData.createdAt).getTime() +
                        365 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()
                  : "01/15/2026"}
              </p>
            </div>
          </div>

          {/* Override Status */}
          <div className="pb-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Access Status
            </h4>

            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full px-4 py-3 bg-white border border-gray-200
                           rounded-xl flex items-center justify-between
                           text-sm font-medium text-gray-800 hover:border-green-300 transition-all cursor-pointer shadow-sm"
              >
                {status}
                {isDropdownOpen ? (
                  <MdOutlineKeyboardArrowUp className="text-gray-400" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="text-gray-400" />
                )}
              </button>

              {/* Dropdown Portal */}
              {isDropdownOpen &&
                createPortal(
                  <div
                    style={{
                      position: "fixed",
                      top: dropdownPos.top + 5,
                      left: dropdownPos.left,
                      width: dropdownPos.width,
                      zIndex: 9999,
                    }}
                    className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 cursor-pointer"
                  >
                    {statuses.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setStatus(option);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-green-50 cursor-pointer ${status === option ? "text-green-600 font-bold bg-green-50/30" : "text-gray-600"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>,
                  document.body,
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 bg-white px-6 py-5 border-t border-gray-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => console.log("Modify Parameters")}
            className="w-full rounded-xl bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)]
                       px-4 py-3 font-bold text-white
                       shadow-lg shadow-green-100 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
