import { baseApi } from "@/redux/hooks/baseApi";

export interface CreateOrganizationRequest {
  organizationCode: string;
  name: string;
  email: string;
  contactPhone: string;
  website: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  bankAccountHolderName: string;
  bankName: string;
  bankAccountLast4: string;
  bankRoutingLast4: string;
  bankCountry: string;
  bankCurrency: string;
}

export interface Organization {
  id: string;
  organizationName: string;
  organizationCode: string;
  email: string;
  contactPhone?: string;
  website?: string;
  country?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  bankAccountHolderName?: string;
  bankName?: string;
  bankAccountLast4?: string;
  bankRoutingLast4?: string;
  bankCountry?: string;
  bankCurrency?: string;
  imaageUrl: string | null;
  accessUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
  lastAccessed: string | null;
  createdAt: string;
  updatedAt: string;
  commissionRatePercent?: number;
  totalCommissionEarned?: number;
  commissionBalance?: number;
  totalCommissionPaid?: number;
  subscriptionPaymentCount?: number;
  lastCommissionAt?: string | null;
}

export interface CreateOrganizationResponse extends Organization {
  organization: any;
}

export interface GetAllOrganizationsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Organization[];
}

export interface ReferredUser {
  id: string;
  athleteFullName: string;
  email: string;
  imgUrl: string | null;
  city: string;
  state: string;
  subscribeStatus: string;
  createdAt: string;
}

export interface OrganizationDetailData {
  organization: Organization & {
    stripeAccountId?: string;
    stripeAccountType?: string;
    stripeOnboardingCompleted?: boolean;
    stripeChargesEnabled?: boolean;
    stripePayoutsEnabled?: boolean;
    onBoardingLink?: string;
    commissionRatePercent?: number;
    totalCommissionEarned?: number;
    commissionBalance?: number;
    totalCommissionPaid?: number;
    subscriptionPaymentCount?: number;
    lastCommissionAt?: string | null;
  };
  referredUsers: ReferredUser[];
}

export interface GetOrganizationDetailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: OrganizationDetailData;
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new organization
    createOrganization: builder.mutation<
      CreateOrganizationResponse,
      CreateOrganizationRequest
    >({
      query: (body) => ({
        url: "/organization",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),

    // Get all organizations
    getAllOrganizations: builder.query<GetAllOrganizationsResponse, void>({
      query: () => ({
        url: "/organization/all",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Organization" as const,
                id,
              })),
              { type: "Organization" as const, id: "LIST" },
            ]
          : [{ type: "Organization" as const, id: "LIST" }],
    }),

    // Get organization by ID
    getOrganizationById: builder.query<GetOrganizationDetailResponse, string>({
      query: (id) => ({
        url: `/organization/details/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Organization", id }],
    }),

    // Track organization access
    trackOrganization: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (code) => ({
        url: `/organization/track/${code}`,
        method: "PATCH",
      }),
    }),

    // Transfer commission to connected account
    transferCommission: builder.mutation<
      { success: boolean; message: string; data: any },
      { organizationId: string; amount: number; currency: string }
    >({
      query: ({ organizationId, ...body }) => ({
        url: `/stripe/admin/organization/${organizationId}/transfer-commission`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),

    // Update organization
    updateOrganization: builder.mutation<
      { success: boolean; message: string; data: Organization },
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/organization/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Organization", id },
        { type: "Organization", id: "LIST" },
      ],
    }),

    // Delete organization
    deleteOrganization: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/organization/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useGetAllOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useTrackOrganizationMutation,
  useTransferCommissionMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;
