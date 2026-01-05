'use server'

import { getToken } from "./cookies";
import api from "@/libs/axios";
import axios from "axios";
import { ReactionType, ViewPostReactionResponse } from "@/types/post";
import { ActionResponse } from "@/types/action";

type APIError = { message?: string; error?: string };

export async function addReactionAction(postId: string, reactionType: string) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Authentication required" };
        }

        const res = await api.post(`/reactions/posts/${postId}`, {
            reactionType: reactionType
        });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error adding reaction";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError;
            message = data?.message || data?.error || "Failed to add reaction";
        }
        
        return { success: false, error: message };
    }
}

export async function removeReactionAction(postId: string){
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Authentication required" };
        }

        const res = await api.delete(`/reactions/posts/${postId}`);
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error removing reaction";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError;
            message = data?.message || data?.error || "Failed to remove reaction";
        }
        
        return { success: false, error: message };
    }
}

export async function viewReactionAction(
  postId: string,
  page: number,
  reactionType?: ReactionType
): Promise<ActionResponse<ViewPostReactionResponse>> {
  try {
    const token = await getToken();
    if (!token) {
        return { success: false, error: "Authentication required" };
    }

    const res = await api.get(`/reactions/posts/${postId}`, {
      params: {
        page,
        ...(reactionType && { reactionType }),
      },
    });

    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error fetching reactions";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError;
      message = data?.message || data?.error || "Failed to fetch reactions";
    }
    
    return { success: false, error: message };
  }
}