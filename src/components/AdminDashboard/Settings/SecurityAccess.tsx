import { useState } from "react";

interface SecurityAccessProps {
  onPasswordChange?: () => void;
}

export default function SecurityAccess({
  onPasswordChange,
}: SecurityAccessProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="w-full p-6 bg-white rounded-xl border border-[#EFEEEE] shadow-lg sm:p-4 md:p-6">
      {/* Header */}
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Security & Access
      </h2>

      {/* Two-Factor Authentication Row */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">
            Two-Factor Authentication
          </p>
          <p className="text-xs text-gray-500">
            High-Security requirement for all admin accounts
          </p>
        </div>

        {/* Custom Toggle Switch */}
        <button
          role="switch"
          aria-checked={twoFactorEnabled}
          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          className={`relative inline-flex items-center h-3 w-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer ${
            twoFactorEnabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          {/* Thumb */}
          <span
            className={`absolute left-0 h-5 w-5 rounded-full bg-[#00A849] shadow-md transition-transform duration-300 ease-out
              ${twoFactorEnabled ? "translate-x-4" : "-translate-x-2"}
            `}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onPasswordChange}
          type="button"
          className="rounded-full border-2 border-green-500 px-6 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 cursor-pointer"
        >
          Change Password
        </button>
        <button
          type="button"
          className="rounded-full border-2 border-green-500 px-6 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 cursor-pointer"
        >
          Active Sessions
        </button>
      </div>
    </div>
  );
}

// import { useState } from "react";

// export default function SecurityAccess({ onClick }: { onClick?: () => void }) {
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

//   return (
//     <div className="w-full p-6 bg-white rounded-xl border border-[#EFEEEE] shadow-lg sm:p-4 md:p-6">
//       {/* Header */}
//       <h2 className="mb-4 text-base font-semibold text-gray-900">
//         Security & Access
//       </h2>

//       {/* Two-Factor Authentication Row */}
//       <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
//         <div>
//           <p className="text-sm font-medium text-gray-900 mb-2">
//             Two-Factor Authentication
//           </p>
//           <p className="text-xs text-gray-500">
//             High-Security requirement for all admin accounts
//           </p>
//         </div>

//         {/* Custom Toggle Switch */}
//         <button
//           role="switch"
//           aria-checked={twoFactorEnabled}
//           onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
//           className={`relative inline-flex items-center h-3 w-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer ${twoFactorEnabled ? "bg-green-500" : "bg-gray-300"}`}
//         >
//           {/* Thumb */}
//           <span
//             className={`absolute left-0 h-5 w-5 rounded-full bg-[#00A849] shadow-md transition-transform duration-300 ease-out
//           ${twoFactorEnabled ? "translate-x-4" : "-translate-x-2"}
//         `}
//           />
//         </button>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <button
//           onClick={onClick}
//           type="button"
//           className="rounded-full border-2 border-green-500 px-6 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 cursor-pointer"
//         >
//           Change Password
//         </button>
//         <button
//           type="button"
//           className="rounded-full border-2 border-green-500 px-6 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 cursor-pointer"
//         >
//           Active Sessions
//         </button>
//       </div>
//     </div>
//   );
// }
