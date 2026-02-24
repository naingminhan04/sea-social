"use server";

import api from "@/libs/axios";
import { ActionResponse } from "@/types/action";
import { LoginSuccessResponse } from "@/types/auth";
import { APIError } from "@/types/error";
import { getRefreshToken } from "./cookies";
import { setAccessCookies, setRefreshCookie } from "./cookies";
import axios from "axios";

export async function refreshAction(): Promise<ActionResponse<LoginSuccessResponse>> {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      return { success: false, error: "Session refresh failed. Please sign in again." };
    }

    const { data } = await api.post("/auth/refresh-token", {
      refreshToken,
    });

    if (data.accessToken) {
      await setAccessCookies(data.accessToken);
      if (data.refreshToken) await setRefreshCookie(data.refreshToken);
    }

    return {
      success: true,
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      },
    };
  } catch (error) {
    let message = "Unexpected error refreshing session";

    if (axios.isAxiosError(error)) {
      const payload = error.response?.data as APIError | undefined;
      message =
        payload?.message ||
        payload?.error ||
        "Session refresh failed. Please sign in again.";
    }

    return { success: false, error: message };
  }
}
