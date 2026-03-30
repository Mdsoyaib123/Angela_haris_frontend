import { cn } from "@/lib/utils";
import { LuCircleCheckBig } from "react-icons/lu";

interface Feature {
  text: string;
}

interface BasicCardProps {
  title?: string; // Added title prop
  features: Feature[];
  onPurchase?: () => void;
  className?: string;
}

export default function BasicCard({
  title = "Starter Tier - FREE", // Default value
  features,
  className,
}: BasicCardProps) {
  return (
    <div
      className={cn(
        "w-full bg-[#E6F6ED] rounded-2xl p-6 shadow-sm border border-[#B0E4C7] flex flex-col justify-between",
        className,
      )}
    >
      {/* Features List */}
      <div className={cn("border-t border-emerald-100 pt-4")}>
        <h1 className="text-[#0F1325] font-semibold text-center text-3xl mb-12">
          {title}
        </h1>
        {/* Features list */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <LuCircleCheckBig
                className="w-5 h-5 text-green-600"
                strokeWidth={3}
              />
              <span className="text-sm text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Button */}
      {/* <button
        onClick={onPurchase}
        className="w-full mt-6 py-3 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
      >
        Free
      </button> */}
    </div>
  );
}

// import { cn } from "@/lib/utils";
// import { LuCircleCheckBig } from "react-icons/lu";

// interface Feature {
//   text: string;
// }

// interface BasicCardProps {
//   features: Feature[];
//   onPurchase?: () => void;
//   className?: string;
// }

// export default function BasicCard({
//   features,
//   onPurchase,
//   className,
// }: BasicCardProps) {
//   return (
//     <div
//       className={cn(
//         "w-full  bg-[#E6F6ED] rounded-2xl p-6 shadow-sm border border-[#B0E4C7] flex flex-col justify-between",
//         className,
//       )}
//     >
//       {/* Features List */}
//       <div className={cn("border-t border-emerald-100 pt-4")}>
//         <h1 className="text-[#0F1325] font-semibold text-center text-3xl mb-12">
//           Basic
//         </h1>
//         {/* Features list */}
//         <div className="space-y-3">
//           {features.map((feature, index) => (
//             <div key={index} className="flex items-center gap-3">
//               <LuCircleCheckBig
//                 className="w-5 h-5 text-green-600" // or use #11D000 for the light green
//                 strokeWidth={3}
//               />
//               <span className="text-sm text-gray-700">{feature.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Purchase Button - Only for purchase variant */}
//       <button
//         onClick={onPurchase}
//         className="w-full mt-6 py-3 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
//       >
//         Free
//       </button>
//     </div>
//   );
// }
