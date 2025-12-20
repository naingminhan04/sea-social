"use server";

import { ImageKitResponse } from "@/types/post";

export async function uploadImagesAction(
  files: File[]
): Promise<ImageKitResponse[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.APP_URL || 
                    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const apiUrl = `${baseUrl}/api/upload`;
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Failed to upload images",
      }));
      throw new Error(errorData.error || "Failed to upload images");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error uploading images");
  }
}

