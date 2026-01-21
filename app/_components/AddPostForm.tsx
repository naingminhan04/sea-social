"use client";

import { Plus, X, LoaderIcon, PenBox } from "lucide-react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { addPostAction, uploadImageAction } from "../_actions/postAction";
import { AddPostType, ImageType, ImageKitResponse } from "@/types/post";
import toast from "react-hot-toast";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { formatDate } from "@/utils/formatDate";
import { useAuthStore } from "@/store/auth";

type FormValues = {
  content: string;
};

const MAX_IMAGES = 20;

export default function AddPostBtn({
  state,
}: {
  state: "nav" | "sidebar" | "reel";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  useLockBodyScroll(isOpen);

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]): Promise<ImageKitResponse[]> => {
      const result = await uploadImageAction(files);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const postMutation = useMutation({
    mutationFn: async (postData: AddPostType) => {
      const result = await addPostAction(postData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

    setIsOpen(false);
    const toastId = toast.loading("Uploading post in progress");

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
      toast.success("Post uploaded successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to create post", { id: toastId });
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
        onClick={() => {
          if (!isLoading) setIsOpen(true);
        }}
        hidden={isOpen}
        className={`${
          state != "reel"
            ? "rounded-md hidden md:block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600"
            : "fixed bottom-10 right-10 rounded-full md:hidden w-14 h-14 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-black"
        }   active:scale-90 flex justify-center items-center z-50 transition-all`}
        aria-label="Add post"
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderIcon className="animate-spin" size={24} />
        ) : state != "reel" ? (
          <div className="flex items-center justify-center gap-1">
            <PenBox size={24} />
          </div>
        ) : (
          <Plus size={24} />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white dark:bg-neutral-900 flex justify-center items-start p-4 overflow-auto z-70">
          <div className="w-full max-w-2xl my-auto">
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-300 hover:bg-gray-100 dark:hover:bg-gray-400 active:scale-95 w-20 h-10 flex justify-center items-center text-white dark:text-black font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPostDisabled}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 w-20 h-10 flex justify-center items-center text-white font-bold disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <span className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
              <div className="pointer-events-auto flex items-center gap-3 my-1">
                <Image
                  src={user?.profilePic || "/default-avatar.png"}
                  alt={user?.name as string}
                  width={100}
                  height={100}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold flex gap-1 text-black dark:text-white">
                    {user?.name}
                    {user?.id === userId && (
                      <span className="text-blue-600 dark:text-blue-500 font-semibold">(You)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="relative h-50">
                <textarea
                  placeholder="What's on your mind?"
                  maxLength={500}
                  className="w-full p-4 rounded-md scrollbar-none bg-white dark:bg-black text-black dark:text-white resize-none h-full outline-0 border border-gray-300 dark:border-neutral-700 focus:border-black dark:focus:border-white focus:border-2 transition-colors"
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
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 active:scale-85 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-100 transition-all disabled:opacity-50"
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
                  className={`w-full border-2 border-dashed border-neutral-600 hover:border-neutral-400 active:border-neutral-600 rounded-lg p-8 flex flex-col justify-center items-center cursor-pointer transition-colors ${
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
