"use client";

import { getAuthToken } from "@/app/_actions/cookies";

/**
 * Generic file response from upload API
 */
export interface UploadedFile {
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Upload files to backend API (which handles S3 upload)
 * Used by AddPostForm, EditPostForm, and Profile components
 */
export async function uploadFiles(files: File[]): Promise<UploadedFile[]> {
  const results: UploadedFile[] = [];

  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in again.");
  }

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://seaapi.mine.bz/v1/api/upload/upload",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name} (${response.status})`);
    }

    const data = await response.json();
    results.push(data);
  }

  return results;
}
