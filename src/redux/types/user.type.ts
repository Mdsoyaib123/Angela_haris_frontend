export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client" | "distributor" | "accountant";
  status: "ACTIVE" | "BLOCKED";
  businessName?: string;
  address_Pickup_Location?: string;
  phone?: string;
  createdAt?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ChangeRolePayload {
  role: "admin" | "client" | "distributor" | "accountant";
}

export interface ChangeStatusPayload {
  status: "ACTIVE" | "BLOCKED";
}
