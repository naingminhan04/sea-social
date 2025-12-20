"use server";

import { getToken } from "./cookies";
import axios from "axios";
import { AddPostType } from "@/types/post";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addPostAction(postData: AddPostType) {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.post(
      `${API_BASE}/posts`,
      {
        content: postData.content || "",
        sharedPostId: postData.sharedPostId || null,
        images: postData.images,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create post"
      );
    }
    throw new Error("Unexpected error creating post");
  }
}
