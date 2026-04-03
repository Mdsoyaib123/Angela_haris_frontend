import {
  useGetPostByIdQuery,
  useGetPostsQuery,
} from "@/redux/features/post/postApi";
import SocialPost from "./SocialPost";
import { useSearchParams } from "react-router-dom";
import ImageSliderPostModal from "../Shared/ImageSlider";
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "@/components/AdminDashboard/Shared/Loader";
import { Post } from "@/redux/types/post.type";

export default function Home() {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadingMoreRef = useRef(false);
  const { ref, inView } = useInView();

  const { data: postsData = [], isLoading, isFetching } = useGetPostsQuery({
    page: String(page),
    limit: "10",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const postIdFromUrl = searchParams.get("postId");
  const { data: singlePost } = useGetPostByIdQuery(
    postIdFromUrl!,
    {
      skip: !postIdFromUrl,
    },
  );

  useEffect(() => {
    if (postsData.length === 0) {
      if (hasMore) setHasMore(false);
      return;
    }

    setAllPosts((prev) => {
      if (page === 1) {
        return postsData;
      }
      const existingIds = new Set(prev.map((p) => p.id));
      const newPosts = postsData.filter((p) => !existingIds.has(p.id));
      if (newPosts.length === 0) return prev;
      return [...prev, ...newPosts];
    });

    const moreAvailable = postsData.length >= 10;
    if (hasMore !== moreAvailable) {
      setHasMore(moreAvailable);
    }
  }, [postsData, page]);

  useEffect(() => {
    if (inView && !isFetching && hasMore && !loadingMoreRef.current) {
      loadingMoreRef.current = true;
      setPage((prev) => prev + 1);
    } else if (!inView) {
      loadingMoreRef.current = false;
    }
  }, [inView, isFetching, hasMore]);

  const activePost = allPosts.find((p) => p.id === postIdFromUrl) ?? singlePost;
  const isImagePost = activePost?.feedType === "POST";
  const isHighlight = activePost?.feedType === "HIGHLIGHT";

  return (
    <div className="">
      <section className="space-y-6">
        {(isLoading && page === 1) && (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        )}
        {allPosts.map((post) => {
          return (
            <SocialPost
              key={post.id}
              {...post}
              onOpen={() => setSearchParams({ postId: post.id })}
            />
          );
        })}

        {/* Sentinel for infinite scroll */}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isFetching && <Loader />}
          {!hasMore && allPosts.length > 0 && (
            <span className="text-sm text-gray-400">No more posts</span>
          )}
        </div>
      </section>
      {postIdFromUrl && activePost && (
        <ImageSliderPostModal
          postId={activePost.id}
          userId={activePost.user.id}
          images={isImagePost ? activePost.images : undefined}
          username={activePost.user.athleteFullName}
          mergedVideoUrl={isHighlight ? activePost.mergedVideoUrl : null}
          feedType={activePost.feedType}
          userImages={activePost.user.imgUrl}
          likes={activePost.totalLikes} // direct from cache
          isLiked={activePost.isLiked}
          caption={activePost.caption || (activePost as any).description}
          postTimeAgo={activePost.createdAt}
          viewCount={activePost.totalViews}
          isOpen={true}
          onClose={() => setSearchParams({})}
        />
      )}
    </div>
  );
}

function PostCardSkeleton() {
  return (
    <div className="w-full bg-transparent rounded-lg flex flex-col md:flex-row animate-pulse p-2">
      {/* Left Image */}
      <div className="w-full md:w-48 h-64 md:h-auto bg-gray-200 rounded-t-lg md:rounded-l-lg md:rounded-t-none" />

      {/* Right Content */}
      <div className="flex-1 min-w-0 flex flex-col space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            {/* Username & Time */}
            <div className="flex flex-col gap-1">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-3 w-20 bg-gray-300 rounded" />
            </div>
          </div>
          {/* Close / More button placeholder */}
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col space-y-3">
          {/* Likes */}
          <div className="h-4 w-24 bg-gray-300 rounded" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-4/6 bg-gray-200 rounded" />
          </div>

          {/* Time */}
          <div className="h-3 w-16 bg-gray-300 rounded" />

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
