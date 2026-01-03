'use server'

import api from "@/libs/axios";
import axios from "axios";
import { PostsResponseType } from "@/types/post";

export async function getPostAction(nextPage: number = 1, limit: number = 10) {
    try {
        const res = await api.get<PostsResponseType>("/posts", {
            params: {
                page: nextPage,
                size: limit,
            }
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            
            if (status === 401) {
                throw new Error("Authentication required. Please log in again.");
            } else if (status === 500) {
                throw new Error("Internal server error. Please try again later.");
            } else if (status === 503) {
                throw new Error("Service temporarily unavailable. Please try again later.");
            } else {
                throw new Error("Check your internet connection and please try again.");
            }
        }
        
        throw new Error("Unexpected error occured while fetching posts. Please try again.");
    }
}