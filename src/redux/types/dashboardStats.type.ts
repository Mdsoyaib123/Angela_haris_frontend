// Base stats interface
export interface DashboardStats {
  free: number;
  pro: number;
  elite: number;
  comped: number;
}

// Transaction interface (empty array in your response, but defined for future use)
export interface DashboardTransaction {
  interval: string;
  id: string;
  transactionId: string;
  customer: string;
  plan: string;
  amount: string | number;
  status: string;
  recieptUrl: string;
}

// Main dashboard response interface
export interface DashboardResponse {
  statusCode: number;
  data: {
    stats: DashboardStats;
    transactions: DashboardTransaction[];
  };
}

// Request type (empty since no request body)
export type DashboardRequest = void;
