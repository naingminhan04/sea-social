'use server'

import { getToken } from "./cookies";
import api from "@/libs/axios";

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