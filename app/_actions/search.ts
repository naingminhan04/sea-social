"use server";

import api from "@/libs/axios";
import axios from "axios";
import { ActionResponse } from "@/types/action";
import { APIError } from "@/types/error";
import { SearchResponseType } from "@/types/search";

export async function searchAction(
  keyword: string,
  limit = 5,
): Promise<ActionResponse<SearchResponseType>> {
  try {
    const res = await api.get<SearchResponseType>("/search", {
      params: {
        keyword,
        limit,
      },
    });

    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error searching posts and users";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      message = data?.message || data?.error || "Failed to search";
    }

    return { success: false, error: message };
  }
}
