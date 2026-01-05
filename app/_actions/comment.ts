'use server'

import api from "@/libs/axios";
import axios from "axios";
import { AddCommentType, CommentResponseType } from "@/types/comment";
import { ActionResponse } from "@/types/action";

type APIError = { message?: string; error?: string };

export async function getCommentAction(postId: string, page: number): Promise<ActionResponse<CommentResponseType>> {
    try {
        const res = await api.get(`/comments/${postId}`, {
            params: {
                page
            }
        });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error fetching comments";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to fetch comments";
        }
        
        return { success: false, error: message };
    }
}

export async function addCommentAction(commentData: AddCommentType, postId: string) {
    try {
        const res = await api.post(`/comments/${postId}`, {
            content: commentData.content || "",
            replyId: commentData.replyId || null,
            images: commentData.images,
        });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error adding comment";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to add comment";
        }
        
        return { success: false, error: message };
    }
}

export async function deleteCommentAction(commentId: string) {
    try {
        const res = await api.delete(`/comments/${commentId}`);
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error deleting comment";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to delete comment";
        }
        
        return { success: false, error: message };
    }
}

export async function getReplyAction(commentId: string) {
    try {
        const res = await api.get(`/comments/${commentId}`);
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error fetching replies";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to fetch replies";
        }
        
        return { success: false, error: message };
    }
}