import { X } from "lucide-react";
import { Highlight } from "@/redux/types/adminMediaMonitoringTypes";
import { toast } from "sonner";

interface MediaClipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHighlight: Highlight | null;
  onRemoveClip: (highlightId: string, order: number) => void;
  isRemovingClip: boolean;
}

export default function MediaClipsModal({
  isOpen,
  onClose,
  selectedHighlight,
  onRemoveClip,
  isRemovingClip,
}: MediaClipsModalProps) {
  if (!isOpen || !selectedHighlight) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRemoveClip = async (order: number) => {
    await onRemoveClip(selectedHighlight.id, order);
  };

  const handleRenderSelected = () => {
    if (selectedHighlight.clips.length === 0) {
      toast.warning("No clips to render", {
        description: "Add some clips first before rendering.",
        duration: 3000,
      });
      return;
    }

    toast.info("Render feature coming soon!", {
      description: "This feature is currently in development.",
      duration: 3000,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 mb-5 border-b border-[#C6CAD1]">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
            Media Segments: {selectedHighlight.caption}
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
          <p className="text-sm text-[#475569]">
            Select segments to export or remove from the public reel.
          </p>

          {selectedHighlight.clips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No clips available for this highlight
            </div>
          ) : (
            [...selectedHighlight.clips]
              .sort((a, b) => a.order - b.order)
              .map((clip) => (
                <div
                  key={clip.order}
                  className="flex justify-between items-center p-3 border border-[#EDF1F3] rounded-2xl"
                >
                  <span className="text-[#1A1C1E] text-base">
                    Clip #{clip.order + 1} -{" "}
                    {clip.key.split(".")[0].slice(0, 20)}
                    {clip.key.length > 20 ? "..." : ""}
                  </span>
                  <button
                    onClick={() => handleRemoveClip(clip.order)}
                    disabled={isRemovingClip}
                    className="font-medium text-[#FF383C] hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRemovingClip ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-5 pt-6">
          <button
            onClick={handleRenderSelected}
            disabled={isRemovingClip}
            className="flex-1 cursor-pointer rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md px-4 py-2 font-medium text-white transition-colors hover:brightness-110 duration-300 disabled:opacity-50"
          >
            Render Selected
          </button>
        </div>
      </div>
    </div>
  );
}

// import { X } from "lucide-react";
// import { Highlight } from "@/redux/types/adminMediaMonitoringTypes";

// interface MediaClipsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedHighlight: Highlight | null;
//   onRemoveClip: (highlightId: string, order: number) => void;
//   isRemovingClip: boolean;
// }

// export default function MediaClipsModal({
//   isOpen,
//   onClose,
//   selectedHighlight,
//   onRemoveClip,
//   isRemovingClip,
// }: MediaClipsModalProps) {
//   if (!isOpen || !selectedHighlight) return null;

//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   const handleRemoveClip = (order: number) => {
//     onRemoveClip(selectedHighlight.id, order);
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center pb-2 mb-5 border-b border-[#C6CAD1]">
//           <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
//             Media Segments: {selectedHighlight.caption}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-[#28303F] cursor-pointer transition-colors"
//             aria-label="Close modal"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="space-y-6">
//           <p className="text-sm text-[#475569]">
//             Select segments to export or remove from the public reel.
//           </p>

//           {selectedHighlight.clips.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No clips available for this highlight
//             </div>
//           ) : (
//             [...selectedHighlight.clips]
//               .sort((a, b) => a.order - b.order)
//               .map((clip) => (
//                 <div
//                   key={clip.order}
//                   className="flex justify-between items-center p-3 border border-[#EDF1F3] rounded-2xl"
//                 >
//                   <span className="text-[#1A1C1E] text-base">
//                     Clip #{clip.order + 1} -{" "}
//                     {clip.key.split(".")[0].slice(0, 20)}
//                     {clip.key.length > 20 ? "..." : ""}
//                   </span>
//                   <button
//                     onClick={() => handleRemoveClip(clip.order)}
//                     disabled={isRemovingClip}
//                     className="font-medium text-[#FF383C] hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isRemovingClip ? "Removing..." : "Remove"}
//                   </button>
//                 </div>
//               ))
//           )}
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex gap-5 pt-6">
//           <button
//             onClick={onClose}
//             disabled={isRemovingClip}
//             className="flex-1 cursor-pointer rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md px-4 py-2 font-medium text-white transition-colors hover:brightness-110 duration-300 disabled:opacity-50"
//           >
//             Render Selected
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
