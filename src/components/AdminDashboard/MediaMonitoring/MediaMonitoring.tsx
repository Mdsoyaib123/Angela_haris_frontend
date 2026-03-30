import { useState } from "react";
import { toast } from "sonner";
import ContentCardComponent from "./ContentCardComponent";
import MediaClipsModal from "./MediaClipsModal";
import {
  useGetHighlightsQuery,
  useRemoveClipMutation,
} from "@/redux/features/admin/adminMediaMonitoring/adminMediaMonitoringApi";
import { Highlight } from "@/redux/types/adminMediaMonitoringTypes";
import Loader from "../Shared/Loader";

export default function MediaMonitoring() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(
    null,
  );
  const [visibleCount, setVisibleCount] = useState(6);

  const { data: highlightsData, isLoading, error } = useGetHighlightsQuery();
  const [removeClip, { isLoading: isRemovingClip }] = useRemoveClipMutation();

  const handleOpenModal = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHighlight(null);
  };

  const handleRemoveClip = async (highlightId: string, order: number) => {
    // Store the highlight for potential rollback
    const currentHighlight = selectedHighlight;

    // Optimistically update the UI
    if (currentHighlight) {
      const updatedHighlight = {
        ...currentHighlight,
        clips: currentHighlight.clips.filter((clip) => clip.order !== order),
      };
      setSelectedHighlight(updatedHighlight);
    }

    // Show loading toast
    const toastId = toast.loading("Removing clip...");

    try {
      await removeClip({ highlightId, order }).unwrap();

      // Show success toast
      toast.success("Clip removed successfully!", {
        id: toastId,
        description: "The clip has been removed from the highlight.",
        duration: 3000,
      });
    } catch (error) {
      // Rollback on error
      if (currentHighlight) {
        setSelectedHighlight(currentHighlight);
      }

      // Show error toast
      toast.error("Failed to remove clip", {
        id: toastId,
        description: (error as any)?.data?.message || "Please try again later.",
        duration: 4000,
      });
      console.error("Failed to remove clip:", error);
    }
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, highlights.length));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Failed to load highlights. Please try again.
      </div>
    );
  }

  const highlights = highlightsData?.data || [];
  const visibleHighlights = highlights.slice(0, visibleCount);
  const hasMore = visibleCount < highlights.length;

  return (
    <div>
      {highlights.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          No highlights available
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {visibleHighlights.map((highlight) => (
              <ContentCardComponent
                key={highlight.id}
                highlight={highlight}
                onClickModal={() => handleOpenModal(highlight)}
                onSelectHighlight={() => setSelectedHighlight(highlight)}
              />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="w-full mt-8">
            {hasMore ? (
              <div className="flex justify-end">
                <button
                  onClick={handleSeeMore}
                  className="px-6 py-2 border border-green-500 rounded-full text-green-600 font-medium hover:bg-green-50 transition-colors cursor-pointer"
                >
                  See More
                </button>
              </div>
            ) : (
              highlights.length > 0 && (
                <div className="text-center text-gray-500">
                  You've reached to the end.
                </div>
              )
            )}
          </div>
        </>
      )}

      <MediaClipsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedHighlight={selectedHighlight}
        onRemoveClip={handleRemoveClip}
        isRemovingClip={isRemovingClip}
      />
    </div>
  );
}

// import { useState } from "react";
// import ContentCardComponent from "./ContentCardComponent";
// import MediaClipsModal from "./MediaClipsModal";
// import {
//   useGetHighlightsQuery,
//   useRemoveClipMutation,
// } from "@/redux/features/admin/adminMediaMonitoring/adminMediaMonitoringApi";
// import { Highlight } from "@/redux/types/adminMediaMonitoringTypes";
// import Loader from "../Shared/Loader";

// export default function MediaMonitoring() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(
//     null,
//   );
//   const [visibleCount, setVisibleCount] = useState(6); // Step 2: initially show 6 posts

//   const { data: highlightsData, isLoading, error } = useGetHighlightsQuery();
//   const [removeClip, { isLoading: isRemovingClip }] = useRemoveClipMutation();

//   const handleOpenModal = (highlight: Highlight) => {
//     setSelectedHighlight(highlight);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedHighlight(null);
//   };

//   const handleRemoveClip = async (highlightId: string, order: number) => {
//     try {
//       await removeClip({ highlightId, order }).unwrap();
//       // Modal will stay open and show updated clips
//     } catch (error) {
//       console.error("Failed to remove clip:", error);
//     }
//   };

//   const handleSeeMore = () => {
//     setVisibleCount((prev) => Math.min(prev + 6, highlights.length));
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-600 p-8">
//         Failed to load highlights. Please try again.
//       </div>
//     );
//   }

//   const highlights = highlightsData?.data || [];
//   const visibleHighlights = highlights.slice(0, visibleCount);
//   const hasMore = visibleCount < highlights.length;

//   return (
//     <div>
//       {highlights.length === 0 ? (
//         <div className="text-center text-gray-500 p-8">
//           No highlights available
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
//             {visibleHighlights.map((highlight) => (
//               <ContentCardComponent
//                 key={highlight.id}
//                 highlight={highlight}
//                 onClickModal={() => handleOpenModal(highlight)}
//                 onSelectHighlight={() => setSelectedHighlight(highlight)}
//               />
//             ))}
//           </div>

//           {/* Pagination controls */}
//           <div className="w-full mt-8">
//             {hasMore ? (
//               // Step 1 & 3: "See more" button right-aligned
//               <div className="flex justify-end">
//                 <button
//                   onClick={handleSeeMore}
//                   className="px-6 py-2 border border-green-500 rounded-full text-green-600 font-medium hover:bg-green-50 transition-colors cursor-pointer"
//                 >
//                   See More
//                 </button>
//               </div>
//             ) : (
//               // Step 4: finish message center-aligned (only shown if there are highlights)
//               highlights.length > 0 && (
//                 <div className="text-center text-gray-500">
//                   You've reached to the end.
//                 </div>
//               )
//             )}
//           </div>
//         </>
//       )}

//       <MediaClipsModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         selectedHighlight={selectedHighlight}
//         onRemoveClip={handleRemoveClip}
//         isRemovingClip={isRemovingClip}
//       />
//     </div>
//   );
// }

// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import ContentCardComponent from "./ContentCardComponent";
// import MediaClipsModal from "./MediaClipsModal";
// import { useGetHighlightsQuery } from "@/redux/features/admin/adminMediaMonitoring/adminMediaMonitoringApi";
// import { Highlight } from "@/redux/types/adminMediaMonitoringTypes";

// export default function MediaMonitoring() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(
//     null,
//   );

//   const { data, isLoading, error, refetch } = useGetHighlightsQuery();

//   const handleOpenModal = (highlight: Highlight) => {
//     setSelectedHighlight(highlight);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedHighlight(null);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <p className="text-red-600 mb-4">Failed to load highlights</p>
//         <button
//           onClick={() => refetch()}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const highlights = data?.data || [];

//   return (
//     <div>
//       {/* Header with Stats */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Total Highlights</p>
//           <p className="text-2xl font-semibold text-gray-800">
//             {highlights.length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Completed</p>
//           <p className="text-2xl font-semibold text-green-600">
//             {highlights.filter((h) => !h.isProcessing).length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Processing</p>
//           <p className="text-2xl font-semibold text-yellow-600">
//             {highlights.filter((h) => h.isProcessing).length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Total Views</p>
//           <p className="text-2xl font-semibold text-blue-600">
//             {highlights.reduce((acc, h) => acc + h.views, 0)}
//           </p>
//         </div>
//       </div>

//       {/* Highlights Grid */}
//       {highlights.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//           <p className="text-gray-600">No highlights found</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
//           {highlights.map((highlight) => (
//             <ContentCardComponent
//               key={highlight.id}
//               highlight={highlight}
//               onClickModal={() => handleOpenModal(highlight)}
//               onSelectHighlight={setSelectedHighlight}
//             />
//           ))}
//         </div>
//       )}

//       {/* Media Clips Modal */}
//       <MediaClipsModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         highlight={selectedHighlight}
//       />
//     </div>
//   );
// }

// import img from "@/assets/angelaharris/MediaMonitoringImg.jpg";
// import ContentCardComponent from "./ContentCardComponent";
// import { useState } from "react";
// import MediaClipsModal from "./MediaClipsModal";

// interface ContentCard {
//   id: number;
//   title: string;
//   creator: string;
//   type: "Video" | "Reel" | "Clip";
//   status: "Completed" | "Processing";
//   views: number;
//   image: string;
// }

// const CONTENT_CARDS: ContentCard[] = [
//   {
//     id: 1,
//     title: "Morning Sprint Training",
//     creator: "Jordan Thompson",
//     type: "Video",
//     status: "Completed",
//     views: 450,
//     image: img,
//   },
//   {
//     id: 2,
//     title: "Vertical Jump Highlight",
//     creator: "Sarah Miller",
//     type: "Reel",
//     status: "Processing",
//     views: 0,
//     image: img,
//   },
//   {
//     id: 3,
//     title: "Gym Session #42",
//     creator: "Elena Gilbert",
//     type: "Clip",
//     status: "Completed",
//     views: 12400,
//     image: img,
//   },
//   {
//     id: 4,
//     title: "Morning Sprint Training",
//     creator: "Jordan Thompson",
//     type: "Video",
//     status: "Completed",
//     views: 450,
//     image: img,
//   },
//   {
//     id: 5,
//     title: "Vertical Jump Highlight",
//     creator: "Sarah Miller",
//     type: "Reel",
//     status: "Processing",
//     views: 0,
//     image: img,
//   },
//   {
//     id: 6,
//     title: "Gym Session #42",
//     creator: "Elena Gilbert",
//     type: "Clip",
//     status: "Completed",
//     views: 12400,
//     image: img,
//   },
// ];

// export default function MediaMonitoring() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
//         {CONTENT_CARDS.map((card) => (
//           <ContentCardComponent
//             key={card.id}
//             card={card}
//             onClickModal={() => setIsModalOpen(true)} // Fixed: Added (true)
//           />
//         ))}
//       </div>

//       {isModalOpen && (
//         <MediaClipsModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// }
