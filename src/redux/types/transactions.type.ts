// src/redux/types/transactions.type.ts

export interface Transaction {
  id: string;
  transactionId: string;
  user: string;
  plan: string;
  amount: number;
  currency: string;
  interval: string;
  status: string;
  billingDate: string;
  receiptUrl: string;
}

export interface TransactionsResponse {
  statusCode: number;
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
