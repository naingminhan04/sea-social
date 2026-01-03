'use server'

import api from "@/libs/axios";
import axios from "axios";
import { AddCommentType } from "@/types/comment";

type APIError = { message?: string; error?: string };

export async function getCommentAction(postId: string, page: number) {
    try {
        const res = await api.get(`/comments/${postId}`, {
            params: {
                page
            }
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            const msg = data?.message || data?.error || "Failed to fetch comments";
            throw new Error(msg);
        }
        throw new Error("Unexpected error fetching comments");
    }
}

export async function addCommentAction(commentData: AddCommentType, postId: string) {
    try {
        const res = await api.post(`/comments/${postId}`, {
            content: commentData.content || "",
            replyId: commentData.replyId || null,
            images: commentData.images,
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            const msg = data?.message || data?.error || "Failed to add comment";
            throw new Error(msg);
        }
        throw new Error("Unexpected error adding comment");
    }
}

export async function deleteCommentAction(commentId: string) {
    try {
        const res = await api.delete(`/comments/${commentId}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            const msg = data?.message || data?.error || "Failed to delete comment";
            throw new Error(msg);
        }
        throw new Error("Unexpected error deleting comment");
    }
}

export async function getReplyAction(commentId: string) {
    try {
        const res = await api.get(`/comments/${commentId}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            const msg = data?.message || data?.error || "Failed to fetch replies";
            throw new Error(msg);
        }
        throw new Error("Unexpected error fetching replies");
    }
}