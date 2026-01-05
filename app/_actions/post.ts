'use server'

import api from "@/libs/axios";
import axios from "axios";
import { PostsResponseType } from "@/types/post";
import { ActionResponse } from "@/types/action";

export async function getPostAction(nextPage: number = 1, limit: number = 10): Promise<ActionResponse<PostsResponseType>> {
    try {
        const res = await api.get<PostsResponseType>("/posts", {
            params: {
                page: nextPage,
                size: limit,
            }
        });
        
        return { success: true, data: res.data };
        
    } catch (error) {
        let message = "Unexpected error occurred while fetching posts. Please try again.";

        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            
            if (status === 401) {
                message = "Authentication required. Please log in again.";
            } else if (status === 500) {
                message = "Internal server error. Please try again later.";
            } else if (status === 503) {
                message = "Service temporarily unavailable. Please try again later.";
            } else {
                message = "Check your internet connection and please try again.";
            }
        }
        
        return { success: false, error: message };
    }
}
