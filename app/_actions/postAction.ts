"use server";

import axios from "axios";
import { getToken } from "./cookies";
import { AddPostType } from "@/types/post";
import { ImageKitResponse } from "@/types/post";
import api from "@/libs/axios";
import { PostsResponseType } from "@/types/post";
import { ActionResponse } from "@/types/action";
import {APIError} from "@/types/error";

export async function getAllPostAction(nextPage: number = 1, limit: number = 10): Promise<ActionResponse<PostsResponseType>> {
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

export async function getPostAction(postId: string) {
    try {
        const res = await api.get(`/posts/${postId}`);
        return { success: true, data: res.data };
    } catch (error) {
        let message = "Unexpected error fetching post";

        if (axios.isAxiosError(error)) {
            const data = error.response?.data as APIError | undefined;
            message = data?.message || data?.error || "Failed to fetch post";
        }
        
        return { success: false, error: message };
    }
}


export async function addPostAction(postData: AddPostType) {
  try {
    const response = await api.post("/posts", {
      content: postData.content || "",
      sharedPostId: postData.sharedPostId || null,
      images: postData.images,
    });

    return { success: true, data: response.data };
  } catch (error) {
    let message = "Unexpected error creating post";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError;
      message = data?.message ?? data?.error ?? "Failed to create post";
    }

    return { success: false, error: message };
  }
}

export async function uploadImageAction(
  files: File[]
): Promise<ActionResponse<ImageKitResponse[]>> {
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`/upload/upload`, formData, {headers: { "Content-Type": "multipart/form-data" }});
      ;
      return response.data;
    });
    const results = await Promise.all(uploadPromises);
    return { success: true, data: results };
  } catch (error) {
    let message = "Unexpected error uploading image";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError;
      message = data?.message ?? data?.error ?? "Failed to upload image";
    }

    return { success: false, error: message };
  }
}

export async function patchPostAction(postId: string, postData: AddPostType) {
  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Failed to get auth token" };
    }

    const images = (postData.images || []).map((img) => ({
  id: img.id,
  path: img.path,
  fullPath: img.fullPath,
}));


    const res = await api.patch(`/posts/${postId}`, {
      content: postData.content || "",
      sharedPostId: postData.sharedPostId || null,
      images,
    });

    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error updating post";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError;
      message = data?.message ?? data?.error ?? "Failed to update post";
    }

    return { success: false, error: message };
  }
}

export async function deletePostAction(postId: string) {
  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Failed to get auth token" };
    }

    const res = await api.delete(`/posts/${postId}`);
    return { success: true, data: res.data };
  } catch (error) {
    let message = "Unexpected error deleting post";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError;
      message = data?.message || data?.error || "Failed to delete post";
    }

    return { success: false, error: message };
  }
}
