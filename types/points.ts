export type PointsTransactionType = {
  id: string;
  type: "EARN" | "SPEND";
  amount: number;
  reason: Record<string, unknown> | null;
  createdAt: string;
};

export interface PointsDailyLoginResponse {
  success: boolean;
  points: number;
  message: string;
}

export interface PointsDailyLoginInfoResponse {
  canClaim: boolean;
  lastClaimDate: string;
  streak: number;
  pointsEarned: number;
  pointsAvailable: number;
  remainingBalance: number;
}

export interface PointsTransactionSummaryType {
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  transactionCount: number;
}

export interface PointsTransactionsResponse {
  transactions: PointsTransactionType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  summary: PointsTransactionSummaryType;
}

export interface PointsTransferBody {
  points: number;
  recipient: string;
}

export interface PointsTransferResponse {
  message: string;
  points: number;
  toUserId: string;
}

export interface PointsTransactionsQueryParams {
  page?: number;
  limit?: number;
  type?: "EARN" | "SPEND";
  startDate?: string;
  endDate?: string;
  reason?: string;
}
