import { Eye, Check, Copy } from "lucide-react";
import { Highlight } from "@/redux/types/adminMediaMonitoringTypes";
import { useState } from "react";

interface ContentCardProps {
  highlight: Highlight;
  onClickModal: () => void;
  onSelectHighlight: () => void;
}

function StatusBadge({ isProcessing }: { isProcessing: boolean }) {
  const status = isProcessing ? "Processing" : "Completed";
  const bgColor = !isProcessing ? "bg-emerald-100" : "bg-orange-100";
  const textColor = !isProcessing ? "text-emerald-700" : "text-orange-700";

  return (
    <span
      className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-medium`}
    >
      {status}
    </span>
  );
}

export default function ContentCardComponent({
  highlight,
  onClickModal,
  onSelectHighlight,
}: ContentCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Determine type based on clips length or other logic
  const getType = () => {
    if (highlight.clips.length === 1) return "Clip";
    if (highlight.clips.length > 1) return "Reel";
    return "Video";
  };

  // Use a placeholder image or user's image
  const displayImage = highlight.user?.imgUrl;

  const handleCopyLink = async () => {
    if (!highlight.highLightsLink) return;

    try {
      await navigator.clipboard.writeText(highlight.highLightsLink);
      setCopiedId(highlight.id);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden rounded-b-2xl">
        <img
          src={displayImage || undefined}
          alt={highlight.caption}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge isProcessing={highlight.isProcessing} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title and Type */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
            {highlight.caption}
          </h3>
          <span className="text-[#475569] text-sm bg-[#EFEEEE] px-4 py-2 font-medium rounded-full">
            {getType()}
          </span>
        </div>

        {/* Creator and Views */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            {highlight.user?.athleteFullName || "Unknown"}
          </p>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Eye className="w-4 h-4" />
            <span>{highlight.views.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              onSelectHighlight();
              onClickModal();
            }}
            disabled={highlight.clips.length === 0}
            className="flex-1 whitespace-nowrap cursor-pointer rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md px-4 py-2 font-medium text-white transition-colors hover:brightness-110 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Manage Clips
          </button>
          <button
            onClick={handleCopyLink}
            disabled={!highlight.highLightsLink || highlight.isProcessing}
            className="flex-1 whitespace-nowrap cursor-pointer rounded-full border border-green-600 bg-transparent px-4 py-2 font-medium text-green-600 transition-colors hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {copiedId === highlight.id ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Shared Links</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// import { Eye } from "lucide-react";

// interface ContentCard {
//   id: number;
//   title: string;
//   creator: string;
//   type: "Video" | "Reel" | "Clip";
//   status: "Completed" | "Processing";
//   views: number;
//   image: string;
// }

// function StatusBadge({ status }: { status: "Completed" | "Processing" }) {
//   const bgColor = status === "Completed" ? "bg-emerald-100" : "bg-orange-100";
//   const textColor =
//     status === "Completed" ? "text-emerald-700" : "text-orange-700";

//   return (
//     <span
//       className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-medium`}
//     >
//       {status}
//     </span>
//   );
// }
// export default function ContentCardComponent({
//   card,
//   onClickModal,
// }: {
//   card: ContentCard;
//   onClickModal: () => void;
// }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       {/* Image Container */}
//       <div className="relative h-48 w-full overflow-hidden rounded-b-2xl">
//         <img
//           src={card.image || "/placeholder.svg"}
//           alt={card.title}
//           className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
//         />
//         {/* Status Badge */}
//         <div className="absolute top-3 right-3">
//           <StatusBadge status={card.status} />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-5 space-y-4">
//         {/* Title and Type */}
//         <div className="flex justify-between items-start">
//           <h3 className="font-semibold text-gray-900 text-base">
//             {card.title}
//           </h3>
//           <span className="text-[#475569] text-sm bg-[#EFEEEE] px-4 py-2 font-medium rounded-full">
//             {card.type}
//           </span>
//         </div>

//         {/* Creator and Views */}
//         <div className="flex justify-between items-center">
//           <p className="text-gray-600 text-sm">{card.creator}</p>
//           <div className="flex items-center gap-1 text-gray-600 text-sm">
//             <Eye className="w-4 h-4" />
//             <span>{card.views.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-2">
//           <button
//             onClick={onClickModal}
//             className="flex-1 whitespace-nowrap cursor-pointer rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
//           >
//             Manage Clips
//           </button>
//           <button className="flex-1 whitespace-nowrap cursor-pointer rounded-full border border-green-600 bg-transparent px-4 py-2 font-medium text-green-600 transition-colors hover:bg-green-50">
//             Shared Links
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
