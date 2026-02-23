"use server";

import { setAuthCookies, setRefreshCookie } from "./cookies";
import api from "@/libs/axios";
import axios from "axios";
import { GoogleLoginInput } from "@/types/auth";
import { ActionResponse } from "@/types/action";
import { LoginSuccessResponse } from "@/types/auth";

export default async function googleLoginAction(input: GoogleLoginInput): Promise<ActionResponse<LoginSuccessResponse>> {
  try {
    const { data } = await api.post("/auth/google-login", input);

    const accessToken = data?.accessToken;
    const refreshToken = data?.refreshToken;

    if (accessToken) {
      await setAuthCookies(accessToken);
      if (refreshToken) await setRefreshCookie(refreshToken);

      return {
        success: true,
        data: {
          message: data.message,
          accessToken,
          refreshToken,
          user: data.user,
          configs: data.configs,
          verificationCodeForTesting: data.verificationCodeForTesting,
        },
      };
    }

    return {
      success: false,
      error: "Google login failed: No access token received",
    };
  } catch (err) {
    let message = "Unexpected server error";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || "Google login failed";
    }

    return { success: false, error: message };
  }
}
