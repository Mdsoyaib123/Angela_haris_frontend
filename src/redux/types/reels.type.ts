export interface Clip {
  key: string;
  url: string;
  order: number;
  s3Key: string;
}

export interface HighlightUser {
  id: string;
  athleteFullName: string;
  imgUrl: string | null;
  role: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  mergedVideoUrl: string;
  caption: string;
  description: string;
  userId: string;
  clips: Clip[];
  isProcessing: boolean;
  updatedAt: string;
  likes: number;
  views: number;
  createdAt: string;
  highLightsLink: string;
  user: HighlightUser;
}

export interface GetHighlightsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Highlight[];
}

export interface MergeVideoResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    mergedVideoUrl: string;
    caption: string;
    description: string;
    userId: string;
    clips: Clip[];
    isProcessing: boolean;
    updatedAt: string;
    likes: number;
    views: number;
    createdAt: string;
    highLightsLink: string;
  };
}

export interface MergeVideoRequest {
  caption: string;
  description: string;
  clips: File[]; // array of video files
}
