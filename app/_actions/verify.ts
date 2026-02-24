"use server";

import api from "@/libs/axios";
import { ActionResponse } from "@/types/action";
import axios from "axios";
import { setAccessCookies, setRefreshCookie, clearVerifyCookies } from "./cookies";
import { VerifySuccessResponse } from "@/types/auth";

export default async function verifyAction(
  email: string,
  verificationCode: string
): Promise<ActionResponse<VerifySuccessResponse>> {
  try {
    const { data } = await api.post("/auth/verify", {
      email,
      verificationCode,
    });

    if (data.accessToken) {
      await setAccessCookies(data.accessToken);
      if (data.refreshToken) await setRefreshCookie(data.refreshToken);
    }

    await clearVerifyCookies();

    return {
      success: true,
      data: {
        message: data.message,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      },
    };
  } catch (err) {
    let message = "Verification failed";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      error: message,
    };
  }
}
