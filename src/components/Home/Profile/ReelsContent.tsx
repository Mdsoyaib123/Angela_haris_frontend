import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import {
  useGetUserFeedsQuery,
  useGetPostByIdQuery,
} from "@/redux/features/post/postApi";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";
import { useGetUserByIdQuery } from "@/redux/features/profile/profileApi";
import PostGrid from "./PostGrid";
import ImageSliderPostModal from "../Shared/ImageSlider";
import Loader from "@/components/AdminDashboard/Shared/Loader";
import { useAppSelector } from "@/hooks/useRedux";

const ReelsContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const postIdFromUrl = searchParams.get("postId");
  const { user } = useAppSelector((state) => state.auth);
  const { id } = useParams();
  const { data: userData } = useAuthMeQuery(undefined, {
    skip: !user,
  });
  const myId: string = userData?.data?.user?.id ?? "";
  const effectiveUserId = id || myId;

  const [page, setPage] = useState(1);
  const [allReelPosts, setAllReelPosts] = useState<any[]>([]);
  const { ref, inView } = useInView();

  const { data: profileData } = useGetUserByIdQuery(effectiveUserId, {
    skip: !effectiveUserId,
  });
  const profileUser = profileData?.data;

  const { data: postsData = [], isFetching } = useGetUserFeedsQuery(
    {
      id: effectiveUserId,
      page: String(page),
      limit: "10",
    },
    { skip: !effectiveUserId },
  );

  // Reset posts when user changes
  useEffect(() => {
    setAllReelPosts([]);
    setPage(1);
  }, [effectiveUserId]);

  // Update posts when data arrives
  useEffect(() => {
    if (postsData.length > 0) {
      setAllReelPosts((prev) => {
        const filteredNewPosts = postsData.filter(
          (p) => p.feedType === "HIGHLIGHT",
        );

        if (page === 1) {
          return filteredNewPosts;
        }

        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = filteredNewPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
    }
  }, [postsData, page]);

  // Handle intersection for infinite scroll
  useEffect(() => {
    if (inView && !isFetching && postsData.length === 10) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isFetching, postsData.length]);

  // Map reelPosts to extract the first two clips and display them
  const clipPosts = useMemo(() => {
    return allReelPosts.flatMap((post) => {
      if (
        post.feedType === "HIGHLIGHT" &&
        post.clips &&
        post.clips.length > 0
      ) {
        const firstThreeClips = post.clips.slice(0, 3);
        return firstThreeClips.map((clip: any, index: number) => {
          return {
            ...post,
            id: `${post.id}-clip-${index}`,
            originalId: post.id,
            mergedVideoUrl: clip.url,
            user: post.user || {
              id: profileUser?.id || effectiveUserId,
              athleteFullName: profileUser?.athleteFullName || "Athlete",
              imgUrl: profileUser?.imgUrl || null,
            },
          };
        });
      }
      return {
        ...post,
        user: post.user || {
          id: profileUser?.id || effectiveUserId,
          athleteFullName: profileUser?.athleteFullName || "Athlete",
          imgUrl: profileUser?.imgUrl || null,
        },
      };
    });
  }, [allReelPosts, profileUser, effectiveUserId]);

  const { data: singlePost } = useGetPostByIdQuery(postIdFromUrl!, {
    skip: !postIdFromUrl,
  });

  const activePost = useMemo(() => {
    const post = allReelPosts.find((p) => p.id === postIdFromUrl) ?? singlePost;
    if (!post) return null;
    return {
      ...post,
      user: post.user || {
        id: profileUser?.id || effectiveUserId,
        athleteFullName: profileUser?.athleteFullName || "Athlete",
        imgUrl: profileUser?.imgUrl || null,
      },
    };
  }, [allReelPosts, postIdFromUrl, singlePost, profileUser, effectiveUserId]);

  const handlePostClick = (postId: string) => {
    // Determine if this is a split clip ID (e.g. uuid-clip-0) and extract the original ID to open the modal
    const originalPostId = postId.includes("-clip-")
      ? postId.split("-clip-")[0]
      : postId;
    setSearchParams({ postId: originalPostId });
  };

  const handleCloseModal = () => {
    setSearchParams({});
  };

  const isImagePost = activePost?.feedType === "POST";
  const isHighlight = activePost?.feedType === "HIGHLIGHT";

  return (
    <>
      <PostGrid posts={clipPosts as any} onPostClick={handlePostClick} />

      {/* Sentinel for infinite scroll */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetching && <Loader />}
      </div>

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

export default ReelsContent;
