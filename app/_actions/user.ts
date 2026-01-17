"use server"

import api from "@/libs/axios";
import { UserResponseType } from "@/types/user";
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
        const message = "Unexpected error fetching users";
        return { success: false, error: message };
    }
}