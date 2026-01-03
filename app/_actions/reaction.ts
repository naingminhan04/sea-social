'use server'

import { getToken } from "./cookies";
import api from "@/libs/axios";
import axios from "axios";
import { ReactionType, ViewPostReactionResponse } from "@/types/post";

type APIError = { message?: string; error?: string };

export async function addReactionAction(postId: string, reactionType: string) {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Authentication required");
        }

        const res = await api.post(`/reactions/posts/${postId}`, {
            reactionType: reactionType
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            const msg = data?.message || data?.error || "Failed to add reaction";
            throw new Error(msg);
        }
        throw error;
    }
}

export async function removeReactionAction(postId: string) {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Authentication required");
        }

        const res = await api.delete(`/reactions/posts/${postId}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            const msg = data?.message || data?.error || "Failed to remove reaction";
            throw new Error(msg);
        }
        throw error;
    }
}

export async function viewReactionAction(
  postId: string,
  page: number,
  reactionType?: ReactionType
): Promise<ViewPostReactionResponse> {
  try {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");

    const res = await api.get(`/reactions/posts/${postId}`, {
      params: {
        page,
        ...(reactionType && { reactionType }),
      },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      const msg = data?.message || data?.error || "Failed to fetch reactions";
      throw new Error(msg);
    }
    throw error;
  }
}