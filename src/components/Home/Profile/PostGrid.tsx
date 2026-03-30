// components/PostGrid.tsx
import { Trash2, Video } from "lucide-react";
import { PiImagesSquareDuotone } from "react-icons/pi";
import Swal from "sweetalert2";
import { Post, ImagePost, HighlightPost } from "@/redux/types/post.type";
import { useDeletePostMutation } from "@/redux/features/post/postApi";

interface PostGridProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
}

const PostGrid = ({ posts, onPostClick }: PostGridProps) => {
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text:
        post.feedType === "POST"
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
      await deletePost({ id: post.id, feedType: post.feedType }).unwrap();
      // Toast notifications are handled inside the mutation
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (!posts.length) {
    return <div className="p-4 text-center text-gray-500">No posts yet.</div>;
  }

  return (
    <div className="p-1 sm:p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 w-full">
        {posts.map((post) => {
          const isImagePost = post.feedType === "POST";
          const isHighlight = post.feedType === "HIGHLIGHT";

          // Determine thumbnail and item count
          let thumbnail = "";
          let itemCount = 0;
          let videoSrc = "";

          if (isImagePost) {
            const imagePost = post as ImagePost;
            thumbnail = imagePost.images[0]?.url || "";
            itemCount = imagePost.images.length;
          } else {
            const highlight = post as HighlightPost;
            videoSrc = highlight.mergedVideoUrl || "";
          }

          return (
            <div
              key={post.id}
              onClick={() => onPostClick(post.id)}
              className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
            >
              {/* Media: image or paused video */}
              {isImagePost ? (
                <img
                  src={thumbnail}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-95"
                  loading="lazy"
                />
              ) : (
                videoSrc && (
                  <video
                    src={videoSrc}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-95"
                    muted
                    playsInline
                    preload="metadata"
                  />
                )
              )}

              {/* Video overlay (only for highlights) */}
              {isHighlight && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Video className="w-7 h-7 text-black" />
                  </div>
                </div>
              )}

              {/* Top right badge */}
              <div className="absolute top-2 right-2 z-30">
                {isImagePost && itemCount > 1 ? (
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/90">
                    <PiImagesSquareDuotone className="w-5 h-5 text-black" />
                  </div>
                ) : isHighlight ? (
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/90">
                    <Video className="w-5 h-5 text-black" />
                  </div>
                ) : null}
              </div>

              {/* Bottom controls */}
              <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition z-40">
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Details", post.id);
                    // optional: open details modal
                  }}
                  className="w-8 h-8 bg-white/90 rounded-md flex items-center justify-center"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button> */}
                <button
                  onClick={(e) => handleDelete(post, e)}
                  className="w-8 h-8 bg-white/90 rounded-md flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostGrid;
