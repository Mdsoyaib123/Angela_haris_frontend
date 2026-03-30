import { Heart, Link, Trash2, Video } from "lucide-react";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { useEffect, useState } from "react";
// import ImageSliderPostModal from "../Shared/ImageSlider";
import { FiEye } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { Post, PostImage, PostUser } from "@/redux/types/post.type";
import { PiImagesSquareDuotone } from "react-icons/pi";
import {
  useDeletePostMutation,
  useLikePostsMutation,
  useMarkPostAsSeenMutation,
} from "@/redux/features/post/postApi";
import { toast } from "sonner";
import { timeAgoShort } from "@/utils/dateUtils";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import Swal from "sweetalert2";

type CardPost = Pick<
  Post,
  | "id"
  | "caption"
  | "createdAt"
  | "totalLikes"
  | "totalViews"
  | "isLiked"
  | "isSeen"
  | "feedType"
> & {
  user: Pick<PostUser, "id" | "athleteFullName" | "imgUrl">;

  // ✅ additional fields
  images?: PostImage[];
  description?: string;
  mergedVideoUrl?: string | null;
  onOpen?: () => void;
};

export default function SocialPost({
  id,
  caption,
  createdAt,
  totalLikes,
  totalViews,
  isSeen,
  isLiked,
  feedType,
  images,
  description,
  mergedVideoUrl,
  user: { athleteFullName: username, imgUrl: avatar },
  // isVerified = true,
  onOpen,
}: CardPost) {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const timeAgoText = timeAgoShort(createdAt);
  const DESCRIPTION_LIMIT = 200;
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  // ✅ Use the mutation hook here
  const [likePosts] = useLikePostsMutation();
  const [markPostAsSeen] = useMarkPostAsSeenMutation();
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text:
        feedType === "POST"
          ? "This post will be permanently deleted."
          : "This highlight will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePost({ id, feedType }).unwrap();
      // Toast notifications are handled inside the mutation
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    if (!isSeen && inView) {
      markPostAsSeen({ id, feedType })
        .unwrap()
        .catch((error) => console.log("Mark as seen response:", error.data));
    }
  }, [inView, id, isSeen, feedType, markPostAsSeen]);

  const contentText = caption || description || "";
  const shouldTruncate = contentText.length > DESCRIPTION_LIMIT;

  const displayDescription =
    !expanded && shouldTruncate
      ? contentText.slice(0, DESCRIPTION_LIMIT)
      : contentText;

  // ✅ Updated handleLike with error handling
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await likePosts({ id, feedType }).unwrap();
    } catch {
      toast.error("Failed to like post");
    }
  };

  return (
    <>
      <div
        className="w-full bg-white md:bg-transparent rounded-2xl md:rounded-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 cursor-pointer shadow-sm md:shadow-none border border-gray-100 md:border-none"
        onClick={() => onOpen?.()}
        ref={ref}
      >
        {/* Media Snippet */}
        <div className="w-full md:w-48 aspect-square sm:aspect-video md:aspect-auto relative overflow-hidden">
          {/* POST → Image */}
          {feedType === "POST" && images && (
            <>
              <img
                src={images[0].url}
                alt="post"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-md bg-white/90 shadow-sm">
                <PiImagesSquareDuotone className="w-4 h-4 text-black" />
              </div>
            </>
          )}

          {/* HIGHLIGHT → Video */}
          {feedType === "HIGHLIGHT" && mergedVideoUrl && (
            <>
              <video
                src={mergedVideoUrl}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 w-7 h-7 rounded-md bg-white/90 flex items-center justify-center shadow-sm">
                <Video className="w-4 h-4 text-black" />
              </div>
            </>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0 flex flex-col bg-white md:ml-4 rounded-b-2xl md:rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between py-2 px-3 sm:px-4 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10 sm:w-13.5 sm:h-13.5 flex items-center justify-center">
                <div className="absolute inset-0 avatar-border z-0"></div>
                <div className="w-8.5 h-8.5 sm:w-12 sm:h-12 avatar-inner z-10 flex items-center justify-center overflow-hidden rounded-full">
                  <img
                    src={avatar || undefined}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1.5 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                    {username}
                  </span>
                  <HiMiniCheckBadge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                </div>
                <span className="text-gray-400 text-[10px] sm:text-sm sm:before:content-['•'] sm:before:mr-1.5">
                  {timeAgoText}
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 px-3 sm:px-5 py-3 sm:py-4 flex flex-col space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                {totalLikes} Likes
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                {timeAgoText}
              </p>
            </div>

            <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
              <span className="text-gray-700 wrap-break-word line-clamp-3 md:line-clamp-none">
                {displayDescription}
              </span>

              {shouldTruncate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  className="ml-1 text-green-600 hover:text-green-700 font-bold text-[10px] sm:text-xs"
                >
                  {expanded ? " SHOW LESS" : " READ MORE"}
                </button>
              )}
            </p>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
              {/* Views */}
              <div className="flex items-center gap-1.5 text-gray-500">
                <FiEye size={16} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">
                  {totalViews}
                </span>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                {/* Like */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(e);
                  }}
                  className="p-1 text-gray-600 hover:text-red-500 transition-all duration-300 transform active:scale-90 cursor-pointer"
                >
                  <Heart
                    size={20}
                    fill={isLiked ? "currentColor" : "none"}
                    className={`transition-all duration-200 sm:w-6 sm:h-6 ${
                      isLiked ? "scale-110 text-red-500" : ""
                    }`}
                  />
                </button>

                {/* Send/Share */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `${window.location.origin}/user/${user?.id}?postId=${id}`;
                    navigator.clipboard.writeText(url);
                    toast.success("Link copied!");
                  }}
                  className="p-1 text-gray-600 hover:text-blue-600 transition-all duration-300 transform active:scale-90 cursor-pointer"
                >
                  <Link size={18} className="sm:w-5 sm:h-5" />
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => handleDelete(e)}
                  className="w-8 h-8 bg-white/90 rounded-md flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
