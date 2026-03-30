export type Role = "ADMIN" | "USER" | "ATHLATE" | "PARENT" | string;

export type User = {
  id: string;
  email: string;
  athleteFullName?: string;
  parentName?: string;
  dateOfBirth?: string;
  city?: string;
  state?: string;
  gradYear?: number;
  position?: string;
  height?: number;
  weight?: number;
  school?: string;
  gpa?: number;
  imgUrl?: string | null;
  role: Role;
  subscribeStatus?: "FREE" | "PREMIUM";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isTwoStepVerification?: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      createdAt: string;
      updatedAt: string;
      stripeCustomerId: string | null;
      subscribeStatus: "FREE" | "PREMIUM";
      athleteFullName: string;
      dateOfBirth: string;
      email: string;
      password: string;
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
      role: Role;
      ppg: number | null;
      rpg: number | null;
      apg: number | null;
      spg: number | null;
      blk: number | null;
    };
    access_token: string;
    refresh_token: string;
    isTwoStepVerification?: boolean;
  };
};

export type RegisterRequest = {
  athleteFullName: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
  athlateeEmail: string; // Athlete email (note spelling per spec)
  parentEmail: string;
  referredBy: string;
  password: string;
  phoneNumber?: string; // Only for athlete
  clubTeam?: string;
  parentName?: string;
  city?: string;
  state?: string;
  gradYear?: number;
  position?: string;
  height?: number;
  weight?: number;
  school?: string;
  gpa?: number;
  fcmToken?: string;
  agreedToTerms: boolean;
  bio?: string;
  image?: File;
  organizationCode?: string;
  role: "ATHLATE" | "PARENT";
};

export type RegisterResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      createdAt: string;
      updatedAt: string;
      stripeCustomerId: string | null;
      subscribeStatus: "FREE" | "PREMIUM";
      athleteFullName: string;
      dateOfBirth: string;
      email: string;
      password: string;
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
      role: Role;
      ppg: number | null;
      rpg: number | null;
      apg: number | null;
      spg: number | null;
      blk: number | null;
    };
    access_token: string;
    refresh_token: string;
  };
};

// types/auth.type.ts
export interface LoginSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  ipAddress: string;
  city: string | null;
  region: string | null;
  country: string | null;
  isActive: boolean;
  lastActive: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface LoginSessionsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: LoginSession[];
}

export type UpdateTwoStepVerificationRequest = {
  userId: string;
  isTwoStepVerification: boolean;
};

export type UpdateTwoStepVerificationResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;
};

export type VerifyTwoStepVerificationRequest = {
  userId: string;
  code: string;
};

export type VerifyTwoStepVerificationResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
};
