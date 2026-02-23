"use server";

import { setAuthCookies, setVerifyCookies, setRefreshCookie } from "./cookies";
import api from "@/libs/axios";
import axios from "axios";
import { LoginInput } from "@/types/auth";
import { ActionResponse } from "@/types/action";
import { LoginSuccessResponse } from "@/types/auth";

export default async function loginAction(
  input: LoginInput,
): Promise<ActionResponse<LoginSuccessResponse>> {
  try {
    const { data } = await api.post("/auth/login", input);

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

    await setVerifyCookies();
    return {
      success: true,
      data: {
        user: data.user,
        verificationCodeForTesting: data.verificationCodeForTesting
      },
    };
  } catch (err) {
    let message = "Unexpected server error";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || "Login Failed";
    }

    return { success: false, error: message };
  }
}
