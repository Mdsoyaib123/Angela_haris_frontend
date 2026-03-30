// redux/types/profile.types.ts

export interface ProfileStats {
  ppg?: number;
  rpg?: number;
  apg?: number;
  spg?: number;
  blk?: number;
}

export interface ProfileData extends ProfileStats {
  id?: string;
  athleteFullName?: string;
  email?: string;
  dateOfBirth?: string;
  imgUrl?: string;
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
  adminTilte?: string;
  profileViews?: number;
  parentEmail?: string;
  bio?: string;
  aauClub?: string;
  clubTeam?: string;
  phoneNumber?: string;
  sports?: string;
  subscribeStatus?: string;
  role?: string;
  isTwoStepVerification?: boolean;
  dominateHand: string;
  jerseyNumber: number;
}

export interface ProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    user: ProfileData;
  };
}

export interface UpdateProfilePayload {
  athleteFullName?: string;
  email?: string;
  dateOfBirth?: string;
  parentName?: string;
  city?: string;
  state?: string;
  gradYear?: number | string;
  position?: string;
  height?: number | string;
  weight?: number | string;
  school?: string;
  gpa?: number | string;
  fcmToken?: string;
  adminTilte?: string;
  ppg?: number | string;
  rpg?: number | string;
  apg?: number | string;
  spg?: number | string;
  blk?: number | string;
  image?: File;
  bio?: string;
  aauClub?: string;
  clubTeam?: string;
  phoneNumber?: string;
  parentEmail?: string;
  sports?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PasswordChangeResponse {
  message: string;
}

// Add this interface for the user in auth state
export interface AuthUser extends ProfileData {
  // Add any auth-specific fields here
  token?: string;
  role?: string;
}

export interface GetCurrentUserResponse {
  user: ProfileData;
}

// export interface ProfileStats {
//   ppg?: number;
//   rpg?: number;
//   apg?: number;
//   spg?: number;
//   blk?: number;
// }

// export interface ProfileData extends ProfileStats {
//   id?: string;
//   athleteFullName?: string;
//   email?: string;
//   dateOfBirth?: string;
//   imgUrl?: string;
//   parentName?: string;
//   city?: string;
//   state?: string;
//   gradYear?: number;
//   position?: string;
//   height?: number;
//   weight?: number;
//   school?: string;
//   gpa?: number;
//   fcmToken?: string;
//   adminTilte?: string;
//   profileViews?: number;
//   parentEmail?: string;
//   bio?: string;
// }

// export interface UpdateProfilePayload {
//   athleteFullName?: string;
//   email?: string;
//   dateOfBirth?: string;
//   parentName?: string;
//   city?: string;
//   state?: string;
//   gradYear?: number;
//   position?: string;
//   height?: number;
//   weight?: number;
//   school?: string;
//   gpa?: number;
//   fcmToken?: string;
//   adminTilte?: string;
//   ppg?: number;
//   rpg?: number;
//   apg?: number;
//   spg?: number;
//   blk?: number;
//   image?: File;
// }

// export interface ChangePasswordPayload {
//   oldPassword: string;
//   newPassword: string;
// }

// export interface ApiResponse<T> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: T;
// }

// export interface PasswordChangeResponse {
//   message: string;
// }
