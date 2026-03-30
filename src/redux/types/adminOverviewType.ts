export interface MonthlyStat {
  month: string;
  monthNumber: number;
  newUsers: number;
}

export interface CurrentYearStats {
  year: number;
  totalNewUsers: number;
  monthlyStats: MonthlyStat[];
}

export interface DashboardStats {
  totalUsers: {
    count: number;
    percentageChange: number;
  };
  activeAthletes: {
    count: number;
    percentageChange: number;
  };
  videoUploads: {
    count: number;
    percentageChange: number;
  };
  totalviews: {
    // ✅ change here (small v)
    count: number;
    percentageChange: number;
  };
  currentYearStats: CurrentYearStats;
}

export interface DashboardStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}

// Transform the API data to match our component needs
export interface TransformedDashboardStats {
  totalUsers: {
    value: string;
    change: string;
  };
  activeAthletes: {
    value: string;
    change: string;
  };
  videoUploads: {
    value: string;
    change: string;
  };
  totalViews: {
    value: string;
    change: string;
  };
  monthlyEngagement: Array<{
    month: string;
    value: number;
  }>;
  // Add this line to include currentYearStats
  currentYearStats: CurrentYearStats;
}

// export interface MonthlyStat {
//   month: string;
//   monthNumber: number;
//   newUsers: number;
// }

// export interface CurrentYearStats {
//   year: number;
//   totalNewUsers: number;
//   monthlyStats: MonthlyStat[];
// }

// export interface DashboardStats {
//   totalUsers: {
//     count: number;
//     percentageChange: number;
//   };
//   activeAthletes: {
//     count: number;
//     percentageChange: number;
//   };
//   videoUploads: {
//     count: number;
//     percentageChange: number;
//   };
//   currentYearStats: CurrentYearStats;
// }

// export interface DashboardStatsResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: DashboardStats;
// }

// // Transform the API data to match our component needs
// export interface TransformedDashboardStats {
//   totalUsers: {
//     value: string;
//     change: string;
//   };
//   activeAthletes: {
//     value: string;
//     change: string;
//   };
//   videoUploads: {
//     value: string;
//     change: string;
//   };
//   monthlyEngagement: Array<{
//     month: string;
//     value: number;
//   }>;
// }

// export interface MonthlyStat {
//   month: string;
//   monthNumber: number;
//   newUsers: number;
// }

// export interface CurrentYearStats {
//   year: number;
//   totalNewUsers: number;
//   monthlyStats: MonthlyStat[];
// }

// export interface DashboardCount {
//   count: number;
//   percentageChange: number;
// }

// export interface DashboardStatsData {
//   totalUsers: DashboardCount;
//   activeAthletes: DashboardCount;
//   videoUploads: DashboardCount;
//   currentYearStats: CurrentYearStats;
// }

// export interface DashboardStatsResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: DashboardStatsData;
// }
