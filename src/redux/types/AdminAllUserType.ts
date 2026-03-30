// src/redux/types/AdminAllUserType.ts

// Define enums to match your backend
export enum UserRole {
  ATHLATE = "ATHLATE",
  PARENT = "PARENT",
}

export enum SubscribeStatus {
  ELITE = "ELITE",
  PRO = "PRO",
  FREE = "FREE",
}

export interface User {
  id: string;
  createdAt: string;
  athleteFullName: string;
  email: string;
  role: UserRole; // Using enum
  subscribeStatus: SubscribeStatus; // Using enum
  isActive: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AllUsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface UserDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId: string | null;
  subscribeStatus: SubscribeStatus; // Using enum
  athleteFullName: string;
  dateOfBirth: string;
  email: string;
  password?: string;
  imgUrl: string | null;
  parentName: string;
  city: string;
  state: string;
  gradYear: number;
  position: string;
  height: number;
  weight: number;
  school: string;
  gpa: number;
  agreedToTerms: boolean;
  fcmToken: string | null;
  isActive: boolean;
  isDeleted: boolean;
  role: UserRole; // Using enum
  ppg: number | null;
  rpg: number | null;
  apg: number | null;
  spg: number | null;
  blk: number | null;
  adminTilte: string | null;
  profileViews: number;
  lastViewed: string | null;
  parentEmail: string;
  referralCode: string;
  referredBy: string | null;
  profileLink: string;
}

export interface ExtendedUserDetails extends UserDetails {
  totalHighlights?: number;
  referredUsers?: {
    count: number;
    list: any[];
  };
}

// Response type for /api/v1/admin/user-details/{userId} (first endpoint)
export interface UserDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserDetails;
}

// Response type for /api/v1/admin/userDetails/{id} (second endpoint)
export interface UserDetailsV2Response {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    success: boolean;
    data: ExtendedUserDetails;
  };
}

// Add planId to AddUserRequest
export interface AddUserRequest {
  athleteFullName: string;
  email: string;
  systemRole: UserRole;
  subscriptionPlan: SubscribeStatus;
  password: string;
  planId: string; // new
}

// Extend AddUserResponse to match the actual API response
export interface AddUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    stripeCustomerId: string | null;
    subscribeStatus: SubscribeStatus;
    bio: string | null;
    athleteFullName: string;
    dateOfBirth: string | null;
    email: string;
    password: string;
    imgUrl: string | null;
    parentName: string | null;
    parentPhone: string | null;
    city: string | null;
    state: string | null;
    gradYear: number | null;
    sports: string | null;
    position: string | null;
    height: number | null;
    weight: number | null;
    school: string | null;
    gpa: number | null;
    agreedToTerms: boolean;
    fcmToken: string | null;
    isActive: boolean;
    isDeleted: boolean;
    role: UserRole;
    ppg: number | null;
    rpg: number | null;
    apg: number | null;
    spg: number | null;
    blk: number | null;
    adminTilte: string | null;
    profileViews: number;
    lastViewed: string | null;
    athlateEmail: string | null;
    referralCode: string | null;
    referredBy: string | null;
    profileLink: string | null;
    oranaizaitonCode: string | null;
    phoneNumber: string | null;
    clubTeam: string | null;
    isTwoStepVerification: boolean;
  };
}

export interface ManageUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
}

export interface ApiError {
  statusCode?: number;
  message?: string;
  error?: string;
}
