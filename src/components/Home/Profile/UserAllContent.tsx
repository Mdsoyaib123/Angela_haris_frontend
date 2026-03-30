// AllContent.tsx
import { useSearchParams } from "react-router-dom";
import {
  useGetPostsQuery,
  useGetPostByIdQuery,
} from "@/redux/features/post/postApi";
import PostGrid from "./PostGrid";
import ImageSliderPostModal from "../Shared/ImageSlider";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";

const UserAllContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const postIdFromUrl = searchParams.get("postId");
  const { data: userData } = useAuthMeQuery();
  const myId: string = userData?.data?.user?.id ?? "";

  const { data: posts = [] } = useGetPostsQuery();

  // 🔍 Filter posts to show only those where the userId matches myId
  const filteredPosts = posts.filter((post) => post.userId === myId);

  const { data: singlePost } = useGetPostByIdQuery(postIdFromUrl!, {
    skip: !postIdFromUrl,
  });

  // Find the active post from filteredPosts OR from singlePost (if opened via URL)
  const activePost =
    filteredPosts.find((p) => p.id === postIdFromUrl) ?? singlePost;

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
      {/* Pass filteredPosts instead of all posts */}
      <PostGrid posts={filteredPosts} onPostClick={handlePostClick} />
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
          caption={isImagePost ? activePost.caption : activePost.description}
          postTimeAgo={activePost.createdAt}
          viewCount={activePost.totalViews}
          isOpen={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default UserAllContent;
