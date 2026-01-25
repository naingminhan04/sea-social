"use server";

import api from "@/libs/axios";
import { ActionResponse } from "@/types/action";
import axios from "axios";
import { setAuthCookies } from "./cookies";
import { clearVerifyCookies } from "./cookies";
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

    await setAuthCookies(data.access_token);

    await clearVerifyCookies();

    return {
      success: true,
      data: {
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
