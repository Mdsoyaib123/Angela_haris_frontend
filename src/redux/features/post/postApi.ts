import { baseApi } from "@/redux/hooks/baseApi";
import {
  CreatePostResponse,
  LikePostResponse,
  MarkPostAsSeenResponse,
  Post,
} from "@/redux/types/post.type";
import toast from "react-hot-toast";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], { page?: string; limit?: string } | void>({
      query: (params) => {
        const page = params?.page || "1";
        const limit = params?.limit || "10";
        return {
          url: `/post-reel/feeds?page=${page}&limit=${limit}`,
        };
      },
      providesTags: ["Posts"],
    }),

    getPostById: builder.query<Post, string>({
      query: (id) => ({
        url: `/post/${id}`,
      }),
    }),

    markPostAsSeen: builder.mutation<
      MarkPostAsSeenResponse,
      { id: string; feedType: "POST" | "HIGHLIGHT" }
    >({
      query: ({ id, feedType }) => ({
        url: `/post-reel/${id}/seen`,
        method: "POST",
        body: { feedType },
      }),
    }),

    likePosts: builder.mutation<
      LikePostResponse,
      { id: string; feedType: "POST" | "HIGHLIGHT" }
    >({
      query: ({ id, feedType }) => ({
        url: `/post-reel/${id}/like`,
        method: "POST",
        body: { feedType },
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // 1. Optimistically update the posts list
        const patchPosts = dispatch(
          postApi.util.updateQueryData(
            "getPosts",
            undefined as any, // This is a bit tricky with pagination, but optimistic updates usually handle the first page/cache
            (draft: Post[]) => {
              const post = draft.find((p) => p.id === id);
              if (post) {
                const wasLiked = post.isLiked;
                post.isLiked = !wasLiked;
                post.totalLikes = wasLiked
                  ? post.totalLikes - 1
                  : post.totalLikes + 1;
              }
            },
          ),
        );

        // 2. Optimistically update the single post (if it's in the cache)
        const patchSingle = dispatch(
          postApi.util.updateQueryData("getPostById", id, (draft: Post) => {
            if (draft) {
              const wasLiked = draft.isLiked;
              draft.isLiked = !wasLiked;
              draft.totalLikes = wasLiked
                ? draft.totalLikes - 1
                : draft.totalLikes + 1;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchPosts.undo();
          patchSingle.undo();
          toast.error("Failed to like post");
        }
      },
    }),

    createPost: builder.mutation<CreatePostResponse, FormData>({
      query: (formData) => ({
        url: "/post/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Posts"],
    }),

    deletePost: builder.mutation<
      | { message: string }
      | {
          statusCode: number;
          success: boolean;
          message: string;
          data: { message: string };
        },
      { id: string; feedType: "POST" | "HIGHLIGHT" }
    >({
      query: ({ id, feedType }) => {
        const url =
          feedType === "POST"
            ? `/post/delete/${id}`
            : `/highlights/deleteHighlights/${id}`;
        return {
          url,
          method: "DELETE", // Using DELETE as per the endpoint design
          body: { id }, // Some backends require the ID in the body even for DELETE
        };
      },
      invalidatesTags: ["Posts"],
      async onQueryStarted({ feedType }, { queryFulfilled }) {
        // Note: id is not needed here; we only use feedType for the success message
        const toastId = toast.loading("Deleting...");
        try {
          await queryFulfilled;
          toast.success(
            feedType === "POST"
              ? "Post deleted successfully"
              : "Highlight deleted successfully",
            { id: toastId },
          );
        } catch {
          toast.error("Failed to delete. Please try again.", { id: toastId });
        }
      },
    }),
    getPostByUserId: builder.query<Post[], string>({
      query: (id) => ({
        url: `/post/user/${id}`,
      }),
    }),
    getUserFeeds: builder.query<
      Post[],
      { id: string; page?: string; limit?: string }
    >({
      query: ({ id, page = "1", limit = "20" }) => ({
        url: `/post-reel/user-feeds/${id}?page=${page}&limit=${limit}`,
      }),
      providesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useLikePostsMutation,
  useCreatePostMutation,
  useMarkPostAsSeenMutation,
  useDeletePostMutation,
  useGetPostByUserIdQuery,
  useGetUserFeedsQuery,
} = postApi;
