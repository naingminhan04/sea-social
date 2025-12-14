"use server";

import { setCookies, setVerifyCookies } from "./cookies";
import api from "@/libs/axios";
import axios from "axios";

type LoginInput = {
  email: string;
  password: string;
};

export default async function loginAction(input: LoginInput) {
  try {
    const { data } = await api.post("/auth/login", input);

    if (data.access_token) {
      const token = data.access_token;
      await setCookies(token);
    } else {
      await setVerifyCookies();
      return {
        user: data.user,
        verificationCode: data.verificationCodeForTesting,
      };
    }

    return {
      user: data.user,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Login Failed");
    }

    throw new Error("Unexpected server error");
  }
}
