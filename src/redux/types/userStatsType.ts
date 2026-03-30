export interface HighlightStats {
  totalCount: number;
  totalViews: number;
  totalLikes: number;
}

export interface UserStats {
  profileViews: number;
  lastViewed: string | null;
  highlights: HighlightStats;
}
