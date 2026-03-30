import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { useAppSelector } from "@/redux/hooks/redux-hook";

const ImageContent = () => {
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
  const [allImagePosts, setAllImagePosts] = useState<any[]>([]);
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
    setAllImagePosts([]);
    setPage(1);
  }, [effectiveUserId]);

  // Update posts when data arrives
  useEffect(() => {
    if (postsData.length > 0) {
      setAllImagePosts((prev) => {
        const filteredNewPosts = postsData.filter((p) => p.feedType === "POST");

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

  // 🔍 Inject user data into posts
  const imagePosts = allImagePosts.map((post) => ({
    ...post,
    user: post.user || {
      id: profileUser?.id || effectiveUserId,
      athleteFullName: profileUser?.athleteFullName || "Athlete",
      imgUrl: profileUser?.imgUrl || null,
    },
  }));

  const { data: singlePost } = useGetPostByIdQuery(postIdFromUrl!, {
    skip: !postIdFromUrl,
  });

  const activePost =
    imagePosts.find((p) => p.id === postIdFromUrl) ?? singlePost;

  const handlePostClick = (postId: string) => {
    setSearchParams({ postId });
  };

  const handleCloseModal = () => {
    setSearchParams({});
  };

  const isImagePost = activePost?.feedType === "POST";
  const isHighlight = activePost?.feedType === "HIGHLIGHT";

  return (
    <>
      <PostGrid posts={imagePosts} onPostClick={handlePostClick} />

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

export default ImageContent;
