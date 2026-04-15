"use server"

import api from "@/libs/axios";
import axios from "axios";
import { APIError } from "@/types/error";
import { ActionResponse } from "@/types/action";
import {
  PointsDailyLoginInfoResponse,
  PointsDailyLoginResponse,
  PointsTransactionsQueryParams,
  PointsTransactionsResponse,
  PointsTransactionType,
  PointsTransactionSummaryType,
  PointsTransferBody,
  PointsTransferResponse,
} from "@/types/points";

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

export async function getDailyLoginInfoAction(): Promise<
  ActionResponse<PointsDailyLoginInfoResponse>
> {
  try {
    const res = await api.get("/points/daily-login-info");
    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error fetching daily login points info";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      message = data?.message || data?.error || message;
    }

    return { success: false, error: message };
  }
}

export async function dailyLoginAction(): Promise<
  ActionResponse<PointsDailyLoginResponse>
> {
  try {
    const res = await api.post("/points/daily-login");
    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error claiming daily points";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      message = data?.message || data?.error || message;
    }

    return { success: false, error: message };
  }
}

export async function getPointsTransactionsAction(
  query: PointsTransactionsQueryParams = {}
): Promise<ActionResponse<PointsTransactionsResponse>> {
  try {
    const res = await api.get("/points/transactions", {
      params: cleanParams(query as Record<string, unknown>),
    });
    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error fetching points transactions";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      message = data?.message || data?.error || message;
    }

    return { success: false, error: message };
  }
}

export async function getPointsTransactionsSummaryAction(): Promise<
  ActionResponse<PointsTransactionSummaryType>
> {
  try {
    const res = await api.get("/points/transactions/summary");
    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error fetching points summary";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      message = data?.message || data?.error || message;
    }

    return { success: false, error: message };
  }
}

export async function getPointTransactionByIdAction(
  transactionId: string
): Promise<ActionResponse<PointsTransactionType>> {
  try {
    const res = await api.get(`/points/transactions/${transactionId}`);
    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error fetching transaction details";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      message = data?.message || data?.error || message;
    }

    return { success: false, error: message };
  }
}

export async function transferPointsAction(
  body: PointsTransferBody
): Promise<ActionResponse<PointsTransferResponse>> {
  try {
    const res = await api.post("/points/transfer", body);
    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error transferring points";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      message = data?.message || data?.error || message;
    }

    return { success: false, error: message };
  }
}
