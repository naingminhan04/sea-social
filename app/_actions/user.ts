"use server"

import api from "@/libs/axios";
import axios from "axios";
import { UserResponseType, UserType, UniqueUsernameResponseType} from "@/types/user";
import { APIError } from "@/types/error";
import { ActionResponse } from "@/types/action";
import { ImageType } from "@/types/post";

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

export async function getUserAction(userId: string): Promise<ActionResponse<UserType>> {
    try {
        const res = await api.get(`/users/profile/${userId}`);
        return { success: true, data: res.data.user };
    } catch (error) {
       let message = "Unexpected error loading user's profile";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to load user's profile";
        }
        
        return { success: false, error: message };
    }
}

export async function getUserByUsernameAction(username: string): Promise<ActionResponse<UserType>> {
    try {
        const res = await api.get(`/users/username/${username}`);
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

export async function checkUniqueUsernameAction(username: string):Promise<ActionResponse<UniqueUsernameResponseType>> {
    try {
        const res = await api.get(`/users/username/unique`, {
            params: {
                username
            }
        });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error checking username";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to check username";
        }
        
        return { success: false, error: message };
    }
}

export async function updateUsernameAction(username: string): Promise<ActionResponse<UserType>> {
    try {
        const res = await api.patch("/users/username", { username });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error updating username";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to update username";
        }
        
        return { success: false, error: message };
    }
}

export async function updateProfilePicAction(profilePic: ImageType): Promise<ActionResponse<UserType>> {
    try {
        const res = await api.patch("/users/profile-pic", { profilePic });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error updating profile picture";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to update profile picture";
        }
        
        return { success: false, error: message };
    }
}

export async function updateCoverPicAction(coverPic: { key: string; fileName: string; mimeType: string; fileSize: number }): Promise<ActionResponse<{ message: string; coverPic: string }>> {
    try {
        const res = await api.patch("/users/cover-pic", { coverPic });
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error updating cover picture";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to update cover picture";
        }
        
        return { success: false, error: message };
    }
}

export async function changePasswordAction(oldPassword: string, newPassword: string, confirmPassword: string): Promise<ActionResponse<null>> {
    try {
        await api.patch("/users/change-password", {
            oldPassword,
            newPassword,
            confirmPassword,
        });
        return { success: true, data: null };
    } catch (error) {
        let message = "Unexpected error changing password";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to change password";
        }
        
        return { success: false, error: message };
    }
}

export async function updateProfileAction(data: {
    name?: string;
    nickname?: string;
    bio?: string;
    phone?: string;
}): Promise<ActionResponse<UserType>> {
    try {
        const res = await api.patch("/users/update-profile", data);
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error updating profile";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to update profile";
        }
        
        return { success: false, error: message };
    }
}