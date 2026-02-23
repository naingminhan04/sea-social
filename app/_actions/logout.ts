"use server";

import api from "@/libs/axios";
import { clearAuthCookies } from "./cookies";
import { ActionResponse } from "@/types/action";
import axios from "axios";

export async function logoutAction(): Promise<ActionResponse<{ message: string }>> {
  try {
    // Call the logout endpoint to revoke tokens on backend
    await api.post("/auth/logout");
  } catch (error) {
    // Even if API call fails, we should still clear local cookies
    console.error("Logout API error:", error);
  }

  // Always clear cookies regardless of API response
  await clearAuthCookies();

  return { success: true, data: { message: "Logged out successfully" } };
}
