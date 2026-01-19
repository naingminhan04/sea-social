"use server"

import api from "@/libs/axios";
import axios from "axios";
import { UserResponseType, UserType } from "@/types/user";
import { APIError } from "@/types/error";
import { ActionResponse } from "@/types/action";

export async function getAllUserAction(nextPage: number = 1, limit: number = 10, keyword: string | null): Promise<ActionResponse<UserResponseType>> {
    try {
        const res = await api.get("/users", {
            params: {
                page: nextPage,
                size: limit,
                keyword
            }
        });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error searching users";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to search users";
        }
        
        return { success: false, error: message };
    }
}

export async function getUserAction( userId : string): Promise<ActionResponse<UserType>> {
    try {
        const res = await api.get(`/users/profile/${userId}`);
        return { success: true, data: res.data };
    } catch (error) {
       let message = "Unexpected error loading user's profile";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to load user's profile";
        }
        
        return { success: false, error: message };
    }
}