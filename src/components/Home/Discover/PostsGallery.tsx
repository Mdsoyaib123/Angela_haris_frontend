import { useState, useRef } from "react";
import { MoreHorizontal, Trash2, Video, Heart } from "lucide-react";
import { PiImagesSquareDuotone } from "react-icons/pi";

interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  itemCount?: number;
}

interface PostsGalleryProps {
  items: MediaItem[];
  onDelete?: (id: string) => void;
  onMenuClick?: (id: string) => void;
}

export default function PostsGallery({
  items,
  onDelete,
  onMenuClick,
}: PostsGalleryProps) {
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [showHeart, setShowHeart] = useState<string | null>(null);

  const lastTapMap = useRef<Record<string, number>>({});

  /* ---------------- LIKE TOGGLE ---------------- */
  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const newValue = !prev[id];

      if (newValue) {
        setShowHeart(id);
        setTimeout(() => setShowHeart(null), 600);
      }

      return {
        ...prev,
        [id]: newValue,
      };
    });
  };

  /* ---------------- DOUBLE TAP DETECTOR ---------------- */
  const handleTap = (id: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    const lastTap = lastTapMap.current[id] || 0;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      toggleLike(id);
    }

    lastTapMap.current[id] = now;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 w-full">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
          onClick={() => handleTap(item.id)}
        >
          {/* ================= MEDIA ================= */}
          {item.type === "image" ? (
            <img
              src={item.src}
              className="
      w-full h-full object-cover
      transition-transform duration-300
      group-hover:scale-105
      group-hover:brightness-95
    "
              loading="lazy"
            />
          ) : (
            <>
              <img
                src={item.thumbnail || item.src}
                className="
        w-full h-full object-cover
        transition-transform duration-300
        group-hover:scale-105
        group-hover:brightness-95
      "
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <Video className="w-7 h-7 text-black" />
                </div>
              </div>
            </>
          )}

          {/* ================= DOUBLE TAP HEART ================= */}
          {showHeart === item.id && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <Heart className="w-10 h-12 sm:w-12 sm:h-12 xl:w-20 xl:h-20 text-red-500 fill-red-500 animate-ping absolute" />
              <Heart className="w-10 h-12 sm:w-12 sm:h-12 xl:w-20 xl:h-20 text-red-500 fill-red-500" />
            </div>
          )}

          {/* ================= TOP RIGHT BADGE ================= */}
          <div className="absolute top-2 right-2 z-30">
            {item.type === "image" && item.itemCount && item.itemCount > 1 ? (
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/90">
                <PiImagesSquareDuotone className="w-5 h-5 text-black" />
              </div>
            ) : item.type === "video" ? (
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/90">
                <Video className="w-5 h-5 text-black" />
              </div>
            ) : null}
          </div>

          {/* ================= BOTTOM CONTROLS ================= */}
          <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition z-40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick?.(item.id);
              }}
              className="w-8 h-8 bg-white/90 rounded-md flex items-center justify-center"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item.id);
              }}
              className="w-8 h-8 bg-white/90 rounded-md flex items-center justify-center"
            >
              <Trash2 className="w-5 h-5 " />
            </button>
          </div>

          {/* ================= LIKE INDICATOR ================= */}
          {likedItems[item.id] && (
            <div className="absolute bottom-3 right-3 z-30 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
