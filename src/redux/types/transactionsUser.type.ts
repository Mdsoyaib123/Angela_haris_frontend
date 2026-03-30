export interface TransactionUser {
  username: string;
  transactionId: string;
  interval: string; // "Yearly" | "Monthly" (optional: you can make union type)
  amount: number;
  status: string; // "Successfull" etc.
  billingDate: string; // ISO date string
  receiptUrl: string;
}

export interface TransactionsUserResponse {
  statusCode: number;
  data: TransactionUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
