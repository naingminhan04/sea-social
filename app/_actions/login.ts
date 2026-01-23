"use server";

import { setAuthCookies, setVerifyCookies } from "./cookies";
import api from "@/libs/axios";
import axios from "axios";
import { LoginInput } from "@/types/auth";
import { ActionResponse } from "@/types/action";
import { LoginSuccessData } from "@/types/user";

export default async function loginAction(input: LoginInput): Promise<ActionResponse<LoginSuccessData>> {
  try {
    const { data } = await api.post("/auth/login", input);

    if (data.access_token) {
      const token = data.access_token;
      await setAuthCookies(token);
      return {
        success: true,
        data: {
          user: data.user,
        },
      };
    } else {
      await setVerifyCookies();
      return {
        success: true,
        data: {
          user: data.user,
          verificationCode: data.verificationCodeForTesting,
        },
      };
    }
  } catch (err) {
    let message = "Unexpected server error";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || "Login Failed";
    }

    return { success: false, error: message };
  }
}
