"use client";

import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { patchPostAction, uploadImageAction } from "../_actions/postAction";
import {
  AddPostType,
  ImageType,
  ImageKitResponse,
  PostType,
} from "@/types/post";
import toast from "react-hot-toast";

type FormValues = {
  content: string;
};

const MAX_IMAGES = 20;

export default function EditPostForm({
  post,
  onClose,
}: {
  post: PostType;
  onClose: () => void;
}) {
  const getSrc = (i: Partial<ImageType & { url?: string }>) => i.fullPath || i.path || "";


  const [existingImages, setExistingImages] = useState<ImageType[]>(
  (post.images ?? []).map(img => ({
    id: img.imageId,    
    path: img.path,        
    fullPath: img.fullPath 
  }))
);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      content: post.content ?? "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]): Promise<ImageKitResponse[]> => {
      const result = await uploadImageAction(files);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onError: (error: Error) =>
      toast.error(error.message),
  });

  const postMutation = useMutation({
    mutationFn: async (postData: AddPostType) => {
      const result = await patchPostAction(post.id, postData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated successfully!");
      setSelectedFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      reset();
      onClose();
    },

    onError: (error: Error) =>
      toast.error(`Failed to update post: ${error.message}`),
  });

  const isLoading = uploadMutation.isPending || postMutation.isPending;

  const handleClose = useCallback(() => {
    if (isLoading) return;

    setSelectedFiles([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    reset();
    onClose();
  }, [previewUrls, reset, isLoading, onClose]);

  const handleUserClose = useCallback(() => {
    if (isLoading) return;
    handleClose();
  }, [isLoading, handleClose]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (
      existingImages.length === 0 &&
      selectedFiles.length === 0 &&
      !data.content.trim()
    ) {
      toast.error("Please add content or at least one image.");
      return;
    }

    if (isLoading) return;

    try {
      let imagesForPost: ImageType[] = [...existingImages];

      if (selectedFiles.length > 0) {
        const uploaded = await uploadMutation.mutateAsync(selectedFiles);

        const newImages: ImageType[] = uploaded.map((img) => ({
          id: img.fileId,
          path: img.path,
          fullPath: img.url,
        }));

        const keyOf = (i: { id?: string; fullPath?: string }) =>
          i.id || i.fullPath || "";
        const existingKeys = new Set(imagesForPost.map(keyOf));
        imagesForPost = imagesForPost.concat(
          newImages.filter((n) => !existingKeys.has(keyOf(n)))
        );
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
      if (isLoading) return;

      const filesArray = Array.from(e.target.files || []);
      const total =
        existingImages.length + selectedFiles.length + filesArray.length;

      if (total > MAX_IMAGES) {
        toast.error(`You can upload up to ${MAX_IMAGES} images.`);
        return;
      }

      setSelectedFiles((prev) => [...prev, ...filesArray]);
      setPreviewUrls((prev) => [
        ...prev,
        ...filesArray.map((file) => URL.createObjectURL(file)),
      ]);
    },
    [existingImages.length, selectedFiles.length, isLoading]
  );

  const removeNewFile = useCallback(
    (index: number) => {
      if (isLoading) return;

      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => {
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
    },
    [isLoading]
  );

  const removeExistingImage = useCallback(
    (index: number) => {
      if (isLoading) return;
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    },
    [isLoading]
  );

  const allImagesCount = existingImages.length + selectedFiles.length;
  const contentValue = watch("content") || "";

  const isPostDisabled =
    isLoading || (allImagesCount === 0 && contentValue.trim() === "");

  return (
    <>
      <div className="fixed inset-0 bg-neutral-900 flex justify-center items-start p-4 overflow-auto z-70">
        <div className="w-full max-w-2xl mt-20">
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleUserClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 active:bg-gray-300 active:scale-95 transition-all w-20 h-10 flex justify-center items-center text-black font-bold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPostDisabled}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-600 active:scale-95 transition-all w-20 h-10 flex justify-center items-center text-white font-bold disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  "Edit"
                )}
              </button>
            </div>

            <div className="relative">
              <textarea
                {...register("content")}
                placeholder="What's on your mind?"
                maxLength={500}
                disabled={isLoading}
                className="w-full p-4 rounded-md bg-black text-white resize-none min-h-[200px] outline-0 border border-neutral-700 focus:border-white focus:border-2"
              />
              <div className="absolute bottom-4 right-2 text-xs">
                {contentValue.length}/500
              </div>
            </div>

            {allImagesCount > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {existingImages.map((img, index) => {
                  const src = getSrc(img);
                  return (
                    <div key={img.id || index} className="relative w-full">
                      <div className="relative w-full aspect-square">
                        {src ? (
                          <Image
                            src={src}
                            alt="Existing image"
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-800 rounded-lg" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        disabled={isLoading}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 active:scale-85 transition-all text-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}

                {selectedFiles.map((_, index) => (
                  <div key={index} className="relative w-full">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={previewUrls[index]}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      disabled={isLoading}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {allImagesCount < MAX_IMAGES && (
                  <label
                    className={`w-full aspect-square border-2 border-dashed border-neutral-600 hover:border-neutral-400 flex justify-center items-center cursor-pointer rounded-lg ${
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
                className={`w-full border-2 border-dashed border-neutral-600 hover:border-neutral-400 rounded-lg p-8 flex flex-col justify-center items-center cursor-pointer ${
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
                  : "Updating post..."}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
