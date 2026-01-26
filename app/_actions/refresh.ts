"use server";

import api from "@/libs/axios";
import { ActionResponse } from "@/types/action";
import { LoginSuccessResponse } from "@/types/auth";
import { UserType } from "@/types/user";
import { APIError } from "@/types/error";
import axios from "axios";

export async function refreshAction(): Promise<ActionResponse<LoginSuccessResponse>> {
  try {
    const { data } = await api.get("/auth/refresh");

    return {
      success: true,
      data: {
        user: data as UserType,
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
