export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year"; // Add more intervals as needed
  features: string[];
  isPopular: boolean;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PricingApiResponse {
  success: boolean;
  data: PricingTier[];
}

// Optional: If you want to derive the type from the array
export type PricingTiers = PricingTier[];

// Optional: For component props
export interface PricingCardProps {
  tier: PricingTier;
  isLoading?: boolean;
}

// Optional: For formatted price display
export interface FormattedPricingTier extends Omit<PricingTier, "priceCents"> {
  formattedPrice: string;
  formattedInterval: string;
}

// Optional: If you want to make certain fields optional for forms/updates
export interface PricingTierFormData {
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  isPopular: boolean;
}

export type CreateCheckoutSessionRequest = {
  priceId: string;
};

export type CreateCheckoutSessionResponse = {
  success: boolean;
  url: string;
};

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  isPopular: boolean;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentPlanData {
  subscriptionId: string;
  stripeSubscriptionId: string;
  status: string;
  startedAt: string;
  endedAt: string;
  plan: Plan;
  price : number;
  name : string
}

export interface CurrentPlanResponse {
  statusCode: number;
  data: CurrentPlanData;
}

// src/redux/types/transaction.type.ts (create new file or add to stripe.type.ts)
export interface TransactionDetailsResponse {
  statusCode: number;
  data: TransactionDetails;
}

export interface TransactionDetails {
  id: string;
  userId: string;
  subscriptionId: string;
  planId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  receiptUrl: string;
  billingDate: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    athleteFullName: string;
  };
  subscription: {
    id: string;
    status: string;
    stripeSubscriptionId: string;
    startedAt: string;
    endedAt: string | null;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
  };
}
