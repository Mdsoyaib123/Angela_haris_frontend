// User
export interface PostUser {
  id: string;
  athleteFullName: string;
  imgUrl: string | null;
}

// Image (POST)
export interface PostImage {
  id: string;
  url: string;
  postId: string;
  createdAt: string;
}

// Clip (HIGHLIGHT)
export interface Clip {
  key: string;
  url: string;
  order: number;
  s3Key: string;
}

// Base post fields (shared)
interface BasePost {
  id: string;
  userId: string;
  caption: string;

  createdAt: string;
  updatedAt: string;

  user: PostUser;

  totalLikes: number;
  totalViews: number;

  isSeen: boolean;
  isLiked: boolean;
}

export interface ImagePost extends BasePost {
  feedType: "POST";

  likes: number;
  comments: number;
  viewCount: number;

  images: PostImage[];
}

export interface HighlightPost extends BasePost {
  feedType: "HIGHLIGHT";

  description: string;

  mergedVideoUrl: string | null;
  clips: Clip[];

  isProcessing: boolean;

  likes: number;
  views: number;

  highLightsLink: string | null;
}

export type Post = ImagePost | HighlightPost;

export type GetPostsResponse = Post[];

export interface LikePostResponse {
  liked: boolean;
  message: string;
}

export type CreatePostResponse = {
  id: string;
  userId: string;
  caption: string;
  likes: number;
  comments: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  images: Array<{
    id: string;
    url: string;
    postId: string;
    createdAt: string;
  }>;
  user: {
    id: string;
    athleteFullName: string;
    email: string;
  };
};

export interface MarkPostAsSeenResponse {
  success: boolean;
  message: string;
}

export interface MarkPostAsSeenRequest {
  feedType: "POST" | "HIGHLIGHT"; // adjust if other values are possible
}
