"use server";

import api from "@/libs/axios";
import { clearAuthCookies } from "./cookies";
import { ActionResponse } from "@/types/action";

export async function logoutAction(): Promise<ActionResponse<{ message: string }>> {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with logout even if API call fails
  }

  try {
    await clearAuthCookies();
    return { success: true, data: { message: "Logged out successfully" } };
  } catch (error) {
    console.error("Clear cookies error:", error);
    return { success: false, error: "Failed to clear session" };
  }
}
