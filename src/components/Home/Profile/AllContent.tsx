import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import {
  useGetUserFeedsQuery,
  useGetPostByIdQuery,
} from "@/redux/features/post/postApi";
import SocialPost from "../Home/SocialPost";
import ImageSliderPostModal from "../Shared/ImageSlider";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";
import { useGetUserByIdQuery } from "@/redux/features/profile/profileApi";
import Loader from "@/components/AdminDashboard/Shared/Loader";
import { useAppSelector } from "@/hooks/useRedux";

// Define types (adjust according to your actual API response)
interface Post {
  id: string;
  feedType: "POST" | "HIGHLIGHT";
  images?: string[];
  mergedVideoUrl?: string | null;
  totalLikes: number;
  isLiked: boolean;
  caption?: string;
  description?: string; // fallback
  createdAt: string;
  totalViews: number;
  user: {
    id: string;
    athleteFullName: string;
    imgUrl: string | null;
  };
}

interface ProfileUser {
  id: string;
  athleteFullName: string;
  imgUrl: string | null;
}

const EMPTY_POSTS: Post[] = [];

const AllContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const postIdFromUrl = searchParams.get("postId");
  const { user } = useAppSelector((state) => state.auth);
  const { id } = useParams();

  // Get current user ID
  const { data: userData } = useAuthMeQuery(
    undefined,
    { skip: !user }, // skip if no user in store
  );
  const myId: string = userData?.data?.user?.id ?? "";
  const effectiveUserId = id || myId;

  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadingMoreRef = useRef(false); // prevent multiple triggers
  const { ref, inView } = useInView();

  // Fetch profile data only for the effective user (used as fallback)
  const { data: profileData } = useGetUserByIdQuery(effectiveUserId, {
    skip: !effectiveUserId,
  });
  const profileUser = profileData?.data as ProfileUser | undefined;

  // Fetch posts with limit 10
  const {
    data: postsData = EMPTY_POSTS,
    isFetching,
    error: feedsError,
  } = useGetUserFeedsQuery(
    {
      id: effectiveUserId,
      page: String(page),
      limit: "10",
    },
    { skip: !effectiveUserId },
  );

  // Reset state when user changes
  useEffect(() => {
    setAllPosts([]);
    setPage(1);
    setHasMore(true);
    loadingMoreRef.current = false;
  }, [effectiveUserId]);

  // Update posts list when data arrives, handling duplicates and page reset
  useEffect(() => {
    if (postsData.length === 0) {
      if (page === 1 && allPosts.length > 0) {
        setAllPosts(EMPTY_POSTS);
      }
      if (hasMore) setHasMore(false);
      return;
    }

    setAllPosts((prev) => {
      if (page === 1) {
        // Replace on page 1 (initial load or user change)
        if (prev === postsData) return prev;
        return postsData as Post[];
      }
      // Append new posts, avoiding duplicates
      const existingIds = new Set(prev.map((p) => p.id));
      const newPosts = (postsData as Post[]).filter(
        (p) => !existingIds.has(p.id),
      );
      if (newPosts.length === 0) return prev;
      return [...prev, ...newPosts];
    });

    // Determine if more data exists
    const moreAvailable = postsData.length >= 10;
    if (hasMore !== moreAvailable) {
      setHasMore(moreAvailable);
    }
  }, [postsData, page, hasMore, allPosts.length]);

  // Infinite scroll: load more when sentinel appears and not already fetching
  useEffect(() => {
    if (inView && !isFetching && hasMore && !loadingMoreRef.current) {
      loadingMoreRef.current = true;
      setPage((prev) => prev + 1);
    } else if (!inView) {
      // Reset lock when sentinel leaves viewport
      loadingMoreRef.current = false;
    }
  }, [inView, isFetching, hasMore]);

  // Reset lock when fetching finishes (so next inView can trigger again)
  useEffect(() => {
    if (!isFetching) {
      loadingMoreRef.current = false;
    }
  }, [isFetching]);

  // Memoized posts with fallback user data (if API doesn't return user)
  const posts = useMemo(() => {
    return allPosts.map((post) => ({
      ...post,
      user: post.user || {
        id: profileUser?.id || effectiveUserId,
        athleteFullName: profileUser?.athleteFullName || "Athlete",
        imgUrl: profileUser?.imgUrl || null,
      },
    }));
  }, [allPosts, profileUser, effectiveUserId]);

  // Fetch single post if modal is open and post not in list
  const { data: singlePost, error: singlePostError } = useGetPostByIdQuery(
    postIdFromUrl!,
    { skip: !postIdFromUrl },
  );

  // Find post from list or use fetched single post
  const activePost = useMemo(() => {
    const fromList = posts.find((p) => p.id === postIdFromUrl);
    if (fromList) return fromList;
    if (singlePost) return singlePost as Post;
    return null;
  }, [posts, postIdFromUrl, singlePost]);

  // If post is not found and modal is open, clear the URL param
  useEffect(() => {
    if (postIdFromUrl && !activePost && !singlePostError) {
      // If singlePostError means not found, clear param
      setSearchParams({});
    }
  }, [postIdFromUrl, activePost, singlePostError, setSearchParams]);

  const handleCloseModal = () => {
    setSearchParams({});
  };

  const isImagePost = activePost?.feedType === "POST";
  const isHighlight = activePost?.feedType === "HIGHLIGHT";

  // Error states
  if (feedsError) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  if (posts.length === 0 && !isFetching) {
    return (
      <div className="p-4 text-center text-gray-500">
        No posts yet. Be the first to share!
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {posts.map((post) => (
          <SocialPost
            key={post.id}
            {...post}
            onOpen={() => setSearchParams({ postId: post.id })}
          />
        ))}

        {/* Sentinel for infinite scroll */}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isFetching && <Loader />}
          {!hasMore && posts.length > 0 && (
            <span className="text-sm text-gray-400">No more posts</span>
          )}
        </div>
      </div>

      {/* Modal */}
      {postIdFromUrl && activePost && (
        <ImageSliderPostModal
          userId={activePost.user.id}
          postId={activePost.id}
          images={isImagePost ? activePost.images : undefined}
          username={activePost.user.athleteFullName}
          mergedVideoUrl={isHighlight ? activePost.mergedVideoUrl : null}
          feedType={activePost.feedType}
          userImages={activePost.user.imgUrl}
          likes={activePost.totalLikes}
          isLiked={activePost.isLiked}
          caption={activePost.caption || (activePost as any).description}
          postTimeAgo={activePost.createdAt}
          viewCount={activePost.totalViews}
          isOpen={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default AllContent;
