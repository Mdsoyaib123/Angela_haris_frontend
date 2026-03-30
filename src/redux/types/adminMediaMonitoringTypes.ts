export interface User {
  id: string;
  athleteFullName: string;
  imgUrl: string | null;
  role: string;
  createdAt: string;
}

export interface Clip {
  key: string;
  url: string;
  order: number;
  s3Key: string;
}

export interface Highlight {
  id: string;
  mergedVideoUrl: string | null;
  caption: string;
  description: string;
  userId: string;
  clips: Clip[];
  isProcessing: boolean;
  updatedAt: string;
  likes: number;
  views: number;
  createdAt: string;
  highLightsLink: string | null;
  user: User;
}

export interface HighlightsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Highlight[];
}

export interface RemoveClipRequest {
  highlightId: string;
  order: number;
}

export interface RemoveClipResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Highlight;
}
