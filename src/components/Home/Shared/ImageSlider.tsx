import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Link as LinkIcon,
  X,
} from "lucide-react";
// import { FaUser } from "react-icons/fa";

// Swiper
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { FiEye } from "react-icons/fi";
import { PostImage } from "@/redux/types/post.type";
import { useLikePostsMutation } from "@/redux/features/post/postApi";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { timeAgoShort } from "@/utils/dateUtils";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks/redux-hook";

export interface ImagesSliderPostModalProps {
  postId: string;
  userId: string;
  images: PostImage[] | undefined;
  username: string;
  mergedVideoUrl: string | null;
  feedType: string;
  userImages: string | null;
  likes: number;
  isLiked: boolean;
  caption: string;
  postTimeAgo: string;
  viewCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageSliderPostModal({
  postId,
  userId,
  images,
  username,
  userImages,
  likes,
  isLiked,
  mergedVideoUrl,
  feedType,
  caption,
  postTimeAgo,
  viewCount,
  isOpen,
  onClose,
}: ImagesSliderPostModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const DESCRIPTION_LIMIT = 120;
  // ✅ Use the mutation hook here too
  const [likePosts] = useLikePostsMutation();
  const timeAgoText = timeAgoShort(postTimeAgo);

  const contentText = caption || "";
  const shouldTruncate = contentText.length > DESCRIPTION_LIMIT;

  const displayDescription =
    !expanded && shouldTruncate
      ? contentText.slice(0, DESCRIPTION_LIMIT)
      : contentText;

  // ✅ Fixed handleLike - using the props directly
  const handleLike = async () => {
    try {
      await likePosts({
        id: postId,
        feedType: feedType as "POST" | "HIGHLIGHT",
      }).unwrap();
    } catch {
      toast.error("Failed to like post");
    }
  };
  const prevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  const nextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const goToSlide = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 p-2 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-6xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT — CAROUSEL SLIDER */}
        <div className="relative bg-black h-full w-full flex items-center justify-center overflow-hidden">
          {/* Mobile/Overlay Close Button */}
          <button
            onClick={onClose}
            className="absolute z-50 top-4 right-4 md:hidden bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
          <Swiper
            modules={[Pagination]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {images &&
              images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.url}
                    alt="slide"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </SwiperSlide>
              ))}
            {mergedVideoUrl && (
              <SwiperSlide key={"video"}>
                <video
                  src={mergedVideoUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                />
              </SwiperSlide>
            )}
          </Swiper>

          {/* Left Button */}
          {images && images.length > 1 && currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute z-30 left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:scale-105 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-black" />
            </button>
          )}

          {/* Right Button */}
          {images && images.length > 1 && currentIndex < images.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute z-30 right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:scale-105 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          )}

          {/* Custom Dots */}
          <div className="absolute z-30 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === index ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* User Icon
          <div className="absolute z-30 bottom-4 left-4 p-2 rounded-full bg-black flex items-center justify-center shadow-lg border border-white/20 cursor-pointer">
            <FaUser className="w-3 h-3 text-white" />
          </div> */}
        </div>

        {/* RIGHT — INSTAGRAM STYLE POST */}
        <div className="flex flex-col h-full min-h-0">
          <div className="flex items-center justify-between px-4 py-6 border-b border-neutral-100 shrink-0">
            <Link
              to={`/${userId}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-13.5 h-13.5 flex items-center justify-center">
                <div className="absolute inset-0 avatar-border z-0"></div>

                <div className="w-12 h-12 avatar-inner z-10">
                  <img
                    src={userImages || "/placeholder.svg"}
                    alt={username}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-semibold text-gray-900">{username}</span>

                <HiMiniCheckBadge className="w-4 h-4 text-blue-500" />

                <span className="text-gray-500 text-sm">• {timeAgoText}</span>
              </div>
            </Link>

            <button onClick={onClose}>
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 ml-0 md:ml-2 px-4 py-4 flex flex-col bg-white rounded-2xl space-y-3">
            {/* Likes */}
            <p className="text-sm font-semibold text-gray-900">{likes} Liked</p>

            <p className="text-gray-900 text-sm leading-relaxed text-justify">
              <span className="font-semibold">{username} </span>

              <span className="text-gray-700 wrap-break-words">
                {displayDescription}
              </span>

              {shouldTruncate && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 text-gray-500 hover:text-gray-800 font-bold cursor-pointer"
                >
                  {expanded ? " less" : "... more"}
                </button>
              )}
            </p>

            {/* Time */}
            <p className="text-xs text-gray-500">{timeAgoText}</p>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2">
              {/* Views */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex items-center gap-1 text-gray-600 cursor-pointer"
              >
                <FiEye size={20} />
                <span className="text-gray-400">{viewCount}</span>
              </button>
              {/* Like */}
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all duration-300 transform hover:scale-110 active:scale-90 cursor-pointer"
              >
                <Heart
                  size={20}
                  fill={isLiked ? "currentColor" : "none"}
                  className={`transition-transform duration-200 ${
                    isLiked ? "scale-125 text-red-500" : ""
                  }`}
                />
              </button>

              {/* Send */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `${window.location.origin}/user/${user?.id}?postId=${postId}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied!");
                }}
                className="p-1 text-gray-600 hover:text-blue-600 transition-all duration-300 transform active:scale-90 cursor-pointer"
              >
                <LinkIcon size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
