"use server";

import axios from "axios";
import { getToken } from "./cookies";
import { AddPostType } from "@/types/post";
import { ImageKitResponse } from "@/types/post";
import api from "@/libs/axios";

type APIError = { message?: string; error?: string };

export async function addPostAction(postData: AddPostType) {

  try {
    const response = await api.post("/posts", {
      content: postData.content || "",
      sharedPostId: postData.sharedPostId || null,
      images: postData.images,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIError | undefined;
      const msg = data?.message ?? data?.error ?? "Failed to create post";
      throw new Error(msg);
    }
    throw new Error("Unexpected error creating post");
  }
}

export async function uploadImageAction(files: File[]): Promise<ImageKitResponse[]> {
    const token = await getToken();
      if (!token) throw new Error("Failed to get auth token");

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

      return Promise.all(uploadPromises);
}
