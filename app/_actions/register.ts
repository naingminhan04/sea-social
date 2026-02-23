import axios, { AxiosError } from "axios";
import api from "@/libs/axios";
import { ActionResponse } from "@/types/action";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  verificationCodeForTesting: number;
};

export async function registerUser(payload: RegisterPayload): Promise<ActionResponse<RegisterResponse>> {
  try {
    const res = await api.post('/auth/register', payload);
    return { success: true, data: res.data };
  } catch (err) {
    let message = "An unexpected error occurred";

    if (axios.isAxiosError(err)) {
      if (err.response && err.response.data && (err.response.data as AxiosError).message) {
        message = (err.response.data as AxiosError).message;
      } else {
        message = "Registration failed. Please try again.";
      }
    }
    
    return { success: false, error: message };
  }
}
