"use server";

import axios from "axios";
import { getToken } from "./cookies";
import { AddPostType } from "@/types/post";
import { ImageKitResponse } from "@/types/post";
import api from "@/libs/axios";
import { ActionResponse } from "@/types/action";

type APIError = { message?: string; error?: string };

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

export async function uploadImageAction(files: File[]): Promise<ActionResponse<ImageKitResponse[]>> {
    try {
        const token = await getToken();
        if (!token) {
            return { success: false, error: "Failed to get auth token" };
        }

        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(`https://famlinkapi.onrender.com/v1/api/upload/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Failed to upload image" }));
            throw new Error(errorData.error || "Failed to upload image");
          }
          return response.json();
        });

        const results = await Promise.all(uploadPromises);
        return { success: true, data: results };
    } catch (error) {
        let message = "Unexpected error uploading images";

        if (error instanceof Error) {
            message = error.message;
        }
        
        return { success: false, error: message };
    }
}

export async function patchPostAction(postId: string, postData: AddPostType){
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