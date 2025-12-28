'use server'

import { getToken } from "./cookies";
import api from "@/libs/axios";
import { ReactionType, ViewPostReactionResponse } from "@/types/post";

export async function addReactionAction(postId: string, reactionType: string) {
    const token = await getToken();

    if (!token) {
        throw new Error("Authentication required");
    }

    const res = await api.post(`/reactions/posts/${postId}`, {
        reactionType: reactionType})
    return res.data;
}

export async function removeReactionAction(postId: string) {
    const token = await getToken();

    if (!token) {
        throw new Error("Authentication required");
    }

    const res = await api.delete(`/reactions/posts/${postId}`)

    return res.data;
}

export async function viewReactionAction(
  postId: string,
  page: number,
  reactionType?: ReactionType
): Promise<ViewPostReactionResponse> {
  const token = await getToken();
  if (!token) throw new Error("Authentication required");

  const res = await api.get(`/reactions/posts/${postId}`, {
    params: {
      page,
      ...(reactionType && { reactionType }),
    },
  });

  return res.data;
}
