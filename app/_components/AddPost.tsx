"use client";

import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { addPostAction } from "../_actions/postAction";
import { AddPostType, ImageType, ImageKitResponse } from "@/types/post";
import toast from "react-hot-toast";

type FormValues = {
  content: string;
};

const MAX_IMAGES = 20;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddPostBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]): Promise<ImageKitResponse[]> => {
      const tokenResponse = await fetch("/api/upload-token");
      if (!tokenResponse.ok) throw new Error("Failed to get auth token");
      const { token } = await tokenResponse.json();

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE}/upload/upload`, {
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
    },
    onError: (error: Error) =>
      toast.error(`Failed to upload images: ${error.message}`),
  });

  const postMutation = useMutation({
    mutationFn: (postData: AddPostType) => addPostAction(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post uploaded successfully!");
      handleClose();
    },
    onError: (error: Error) =>
      toast.error(`Failed to create post: ${error.message}`),
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedFiles([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    reset();
  }, [previewUrls, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (selectedFiles.length === 0 && !data.content.trim()) {
      toast.error("Please add content or at least one image.");
      return;
    }

    try {
      let imagesForPost: ImageType[] = [];
      if (selectedFiles.length > 0) {
        const uploadedImages = await uploadMutation.mutateAsync(selectedFiles);
        imagesForPost = uploadedImages.map((img) => ({
          id: img.fileId,
          path: img.path,
          fullPath: img.url,
        }));
      }

      await postMutation.mutateAsync({
        content: data.content || null,
        sharedPostId: null,
        images: imagesForPost,
      });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filesArray = Array.from(e.target.files || []);
      const totalFiles = selectedFiles.length + filesArray.length;
      if (totalFiles > MAX_IMAGES) {
        toast.error(`You can upload up to ${MAX_IMAGES} images.`);
        return;
      }

      const newFiles = [...selectedFiles, ...filesArray].slice(0, MAX_IMAGES);
      setSelectedFiles(newFiles);

      const newPreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    },
    [selectedFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...selectedFiles];
      const newPreviews = [...previewUrls];
      URL.revokeObjectURL(newPreviews[index]);
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);
      setSelectedFiles(newFiles);
      setPreviewUrls(newPreviews);
    },
    [selectedFiles, previewUrls]
  );

  const isLoading = uploadMutation.isPending || postMutation.isPending;
  const contentValue = watch("content") || "";
  const isPostDisabled =
    isLoading || (selectedFiles.length === 0 && contentValue.trim() === "");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        hidden={isOpen}
        className="fixed md:absolute bottom-10 right-10 rounded-full w-14 h-14 bg-neutral-700 hover:bg-black flex justify-center items-center cursor-pointer z-50 transition-colors"
        aria-label="Add post"
      >
        <Plus size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-neutral-900 flex justify-center items-start p-4 overflow-auto z-40">
          <div className="w-full max-w-2xl mt-20">
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 w-20 h-10 flex justify-center items-center text-black font-bold disabled:opacity-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPostDisabled}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 w-20 h-10 flex justify-center items-center text-white font-bold disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>

              <div className="relative">
                <textarea
                  placeholder="What's on your mind?"
                  maxLength={500}
                  className="w-full p-4 rounded-md bg-black text-white resize-none min-h-[200px] outline-0 border border-neutral-700 focus:border-white focus:border-2 transition-colors"
                  {...register("content")}
                  disabled={isLoading}
                />
                <div className="absolute bottom-4 right-2 text-xs">
                  {contentValue.length}/500
                </div>
              </div>

              {selectedFiles.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative group w-full"
                    >
                      <div className="relative w-full aspect-square">
                        <Image
                          src={previewUrls[index]}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-100 transition-opacity disabled:opacity-50"
                        disabled={isLoading}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {selectedFiles.length < MAX_IMAGES && (
                    <label
                      className={`w-full aspect-square border-2 border-dashed border-neutral-600 hover:border-neutral-400 flex justify-center items-center cursor-pointer rounded-lg transition-colors ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Plus size={24} className="text-neutral-400" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              ) : (
                <label
                  className={`w-full border-2 border-dashed border-neutral-600 hover:border-neutral-400 rounded-lg p-8 flex flex-col justify-center items-center cursor-pointer transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Plus size={32} className="text-neutral-400 mb-2" />
                  <span className="text-neutral-400 text-sm">
                    Add images ({MAX_IMAGES} max)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              )}

              {isLoading && (
                <div className="text-center text-neutral-400 text-sm">
                  {uploadMutation.isPending
                    ? "Uploading images..."
                    : "Creating post..."}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
