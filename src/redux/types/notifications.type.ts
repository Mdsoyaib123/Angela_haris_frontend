// Define types based on API response
export interface NotificationSender {
  athleteFullName: string;
  imgUrl: string | null;
}

export interface NotificationPostImage {
  id: string;
  url: string;
  postId: string;
  createdAt: string;
}

export interface NotificationPost {
  images: NotificationPostImage[];
  caption: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  userId: string;
  senderId: string;
  postId: string | null;
  highlightId: string | null;
  createdAt: string;
  sender: NotificationSender;
  post: NotificationPost | null;
}
