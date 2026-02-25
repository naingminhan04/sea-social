"use client";

import { PostType } from "@/types/post";
import { MessageCircle, SendHorizonal, ChevronDown, ChevronUp, Pencil, Trash2, X } from "lucide-react";
import { formatCount } from "./PostCard";
import { useState } from "react";
import Link from "next/link";
import {
  addCommentAction,
  getCommentAction,
  deleteCommentAction,
  getReplyAction,
  patchCommentAction,
} from "../_actions/comment";
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AddCommentType,
  CommentResponseType,
  CommentType,
} from "@/types/comment";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { uploadFiles } from "@/utils/uploadUtils";

const CommentBtn = ({ post, view }: { post: PostType; view: boolean }) => {
  if (view)
    return (
      <div className="flex items-center hover:bg-blue-300 active:bg-blue-300 dark:hover:bg-neutral-500 dark:active:bg-neutral-500 hover:text-black dark:hover:text-white justify-center px-2 h-10 rounded-xl transition active:scale-95">
        <button className="flex gap-1 transition">
          <MessageCircle size={18} />
          {post.stats.comments > 0 && (
            <span>{formatCount(post.stats.comments)}</span>
          )}
        </button>
      </div>
    );

  return (
    <Link
      href={`/posts/${post.id}`}
      className="flex items-center justify-center px-2 h-10 rounded-xl transition hover:bg-blue-300 active:bg-blue-300 dark:hover:bg-neutral-500 dark:active:bg-neutral-500 hover:text-black dark:hover:text-white active:scale-95"
    >
      <button className="flex gap-1 transition">
        <MessageCircle size={18} />
        {post.stats.comments > 0 && (
          <span>{formatCount(post.stats.comments)}</span>
        )}
      </button>
    </Link>
  );
};

export default CommentBtn;

export const CommentPage = ({ postId }: { postId: string }) => {
  const auth = useAuthStore();
  const userId = auth.user?.id;
  const queryClient = useQueryClient();
  const [isDel, setIsDel] = useState<string[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery<CommentResponseType>({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getCommentAction(postId, pageParam as number);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });

  const handleDelete = async (commentId: string) => {
    setIsDel((prev) => [...prev, commentId]);

    try {
      const result = await deleteCommentAction(commentId);
      if (!result.success) {
        toast.error("Failed to delete comment");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDel((prev) => prev.filter((id) => id !== commentId));
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[10vh] flex-1">
        <span className="w-8 h-8 rounded-full border-2 border-black/30 border-t-black dark:border-white/30 dark:border-t-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center flex-1 min-h-[10vh] w-full h-full gap-4 p-4">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">Failed to load comments</p>
          <p className="text-sm text-gray-400">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-black active:scale-90 text-white rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className="flex flex-col">
      <main className="px-5 py-3 space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-400 text-center">No comments yet</p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <CommentCard
              comment={comment}
              postId={postId}
              isDel={isDel}
              isOwner={userId === comment.user.id}
              onDelete={handleDelete}
              onReply={() => setReplyingTo(comment.id)}
              onEdit={() => setEditingCommentId(comment.id)}
              isEditing={editingCommentId === comment.id}
              onCancelEdit={() => setEditingCommentId(null)}
              repliesExpanded={expandedReplies.includes(comment.id)}
              onToggleReplies={() => toggleReplies(comment.id)}
            />

            {/* Show reply form if replying to this comment */}
            {replyingTo === comment.id && (
              <div className="ml-10 mt-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Replying to <span className="font-semibold">{comment.user.name}</span>
                </p>
                <CommentForm
                  postId={postId}
                  replyId={comment.id}
                  onSuccess={() => setReplyingTo(null)}
                />
              </div>
            )}

            {/* Show replies if expanded */}
            {comment.stats.replies > 0 && expandedReplies.includes(comment.id) && (
              <Replies
                postId={postId}
                commentId={comment.id}
                userId={userId}
                onReply={(replyId) => setReplyingTo(replyId)}
              />
            )}

            {/* Show toggle button for replies */}
            {comment.stats.replies > 0 && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="ml-10 text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
              >
                {expandedReplies.includes(comment.id) ? (
                  <>
                    <ChevronUp size={14} /> Hide {comment.stats.replies} {comment.stats.replies === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} /> Show {comment.stats.replies} {comment.stats.replies === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </main>

      {hasNextPage && (
        <footer className="p-4 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-blue-400 hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <span className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              "Load more comments"
            )}
          </button>
        </footer>
      )}
    </div>
  );
};

interface CommentCardProps {
  comment: CommentType;
  postId: string;
  isDel: string[];
  isOwner: boolean;
  onDelete: (id: string) => void;
  onReply: () => void;
  onEdit: () => void;
  isEditing: boolean;
  onCancelEdit: () => void;
  repliesExpanded: boolean;
  onToggleReplies: () => void;
}

const CommentCard = ({
  comment,
  postId,
  isDel,
  isOwner,
  onDelete,
  onReply,
  onEdit,
  isEditing,
  onCancelEdit,
  onToggleReplies,
}: CommentCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`flex gap-3 p-3 rounded-lg transition ${
        isEditing ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-600" : ""
      } ${
        isDel.includes(comment.id) && "opacity-50 pointer-events-none"
      }`}
    >
      {/* Connection line for replies - only first line */}
      {comment.replyId && (
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-gray-300 dark:bg-neutral-600" />
        </div>
      )}

      <div className="flex gap-3 flex-1">
        <Link target="_blank" href={`/users/${comment.user.username}`}>
          <Image
            width={8}
            height={8}
            src={comment.user.profilePic || "/default-avatar.png"}
            alt={comment.user.name}
            className="w-8 h-8 rounded-full hover:brightness-85 active:brightness-85 transition-all bg-gray-300 object-cover"
          />
        </Link>

        <div className="flex flex-col flex-1 max-w-[80%]">
          {/* Edit Mode */}
          {isEditing ? (
            <CommentEditForm
              comment={comment}
              postId={postId}
              onSuccess={onCancelEdit}
              onCancel={onCancelEdit}
            />
          ) : (
            <>
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-gray-500 dark:text-neutral-400 text-sm">
                    <Link
                      target="_blank"
                      href={`/users/${comment.user.username}`}
                      className="hover:text-neutral-900 dark:hover:text-gray-300 active:text-neutral-900 dark:active:text-gray-300 transition-all font-semibold"
                    >
                      {comment.user.name}
                    </Link>
                    <span className="font-extralight text-xs mx-2 text-gray-400 dark:text-gray-300">
                      {formatDate(comment.createdAt, false, true)}
                    </span>
                    {comment.isEdited && (
                      <span className="text-xs text-gray-400">[edited]</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Comment Content */}
              <p className="whitespace-pre-wrap wrap-break-word text-sm mt-1">
                {comment.content}
              </p>

              {/* Comment Image */}
              {comment.images.length > 0 && (
                <div className="mt-2">
                  <Image
                    src={comment.images[0].url || "/alt.png"}
                    alt="comment image"
                    width={200}
                    height={200}
                    className="rounded-lg max-w-xs"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 text-xs text-gray-400 mt-2 items-center">
                <button
                  onClick={onReply}
                  className="hover:text-blue-500 active:text-blue-400 transition-colors"
                >
                  Reply
                </button>
                
                {isOwner && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={onEdit}
                      className="hover:text-amber-500 active:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="hover:text-red-500 active:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface RepliesProps {
  commentId: string;
  postId: string;
  userId?: string;
}

const Replies = ({ commentId, postId, userId }: RepliesProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [isDel, setIsDel] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const result = await getReplyAction(postId, commentId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (replyId: string) => {
    setIsDel((prev) => [...prev, replyId]);
    try {
      const result = await deleteCommentAction(replyId);
      if (!result.success) {
        toast.error("Failed to delete reply");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
      await queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Reply deleted");
    } catch (err) {
      toast.error("Failed to delete reply");
    } finally {
      setIsDel((prev) => prev.filter((id) => id !== replyId));
    }
  };

  if (isLoading) return <div className="ml-10 text-xs text-gray-400">Loading replies...</div>;

  const replies = (data?.replies ?? data?.comments ?? []) as CommentType[];

  return (
    <div className="ml-10 mt-2 space-y-3 border-l-2 border-gray-300 dark:border-neutral-600 pl-4">
      {replies.map((reply: CommentType) => (
        <div key={reply.id}>
          <CommentCard
            comment={reply}
            postId={postId}
            isDel={isDel}
            isOwner={userId === reply.user.id}
            onDelete={handleDelete}
            onReply={() => setReplyingTo(reply.id)}
            onEdit={() => setEditingReplyId(reply.id)}
            isEditing={editingReplyId === reply.id}
            onCancelEdit={() => setEditingReplyId(null)}
            repliesExpanded={false}
            onToggleReplies={() => {}}
          />

          {/* Reply form for nested replies */}
          {replyingTo === reply.id && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Replying to <span className="font-semibold">{reply.user.name}</span>
              </p>
              <CommentForm
                postId={postId}
                replyId={reply.id}
                onSuccess={() => setReplyingTo(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface CommentFormProps {
  postId: string;
  replyId?: string | null;
  onSuccess?: () => void;
}

export const CommentForm = ({
  postId,
  replyId = null,
  onSuccess,
}: CommentFormProps) => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<AddCommentType>({
    defaultValues: {
      content: "",
      replyId: replyId ?? null,
      images: [],
    },
  });

  const content = watch("content");

  const mutation = useMutation({
    mutationFn: async (data: AddCommentType) => {
      let images: Array<{
        key: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
      }> = [];

      // Upload image if selected
      if (selectedFile) {
        try {
          const uploadedImages = await uploadFiles([selectedFile]);
          if (uploadedImages && uploadedImages.length > 0) {
            images = [uploadedImages[0]];
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Failed to upload image");
        }
      }

      const result = await addCommentAction(
        {
          content: data.content || "",
          replyId: data.replyId ?? replyId ?? null,
          images,
        },
        postId
      );
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (replyId) {
        queryClient.invalidateQueries({ queryKey: ["replies", replyId] });
      }
      toast.success(replyId ? "Reply posted" : "Comment posted");
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      onSuccess?.();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit: SubmitHandler<AddCommentType> = async (data) => {
    if (!data.content || !data.content.trim()) {
      toast.error("Please add content.");
      return;
    }

    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const isDisabled = mutation.isPending || !content.trim();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full z-10 space-y-2"
    >
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative w-20 h-20">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white transition"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        {/* Image Upload Button - Leftmost */}
        <label className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition text-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={mutation.isPending || selectedFile !== null}
            className="hidden"
          />
          📷
        </label>

        <div className="flex-1 space-y-1">
          <textarea
            placeholder={replyId ? "Write a reply..." : "Write a comment..."}
            maxLength={500}
            className="w-full p-2 rounded-md bg-white dark:bg-black text-black dark:text-white resize-none h-10 outline-none border border-gray-300 dark:border-neutral-700 focus:border-black dark:focus:border-neutral-500 scrollbar-none text-sm"
            {...register("content")}
            disabled={mutation.isPending}
          />
          {content.length > 450 && (
            <div className="text-xs text-gray-400">
              {content.length}/500
            </div>
          )}
        </div>

        {/* Submit Button */}
        {mutation.isPending ? (
          <span className="w-8 h-8 rounded-full border-2 border-black/30 border-t-black dark:border-white/30 dark:border-t-white cursor-progress animate-spin" />
        ) : (
          <button
            type="submit"
            disabled={isDisabled}
            className={`px-3 py-2 h-10 rounded bg-blue-400 text-white dark:bg-white dark:text-black flex items-center justify-center ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-500 dark:hover:bg-neutral-300 active:scale-90 transition-all"
            }`}
          >
            <SendHorizonal size={18} />
          </button>
        )}
      </div>
    </form>
  );
};

interface CommentEditFormProps {
  comment: CommentType;
  postId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CommentEditForm = ({
  comment,
  postId,
  onSuccess,
  onCancel,
}: CommentEditFormProps) => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    comment.images[0]?.url || null
  );

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<AddCommentType>({
    defaultValues: {
      content: comment.content,
      replyId: comment.replyId ?? null,
      images: comment.images.length > 0 ? [{
        key: comment.images[0].key,
        fileName: comment.images[0].fileName,
        mimeType: comment.images[0].mimeType,
        fileSize: comment.images[0].fileSize,
      }] : [],
    },
  });

  const content = watch("content");

  const mutation = useMutation({
    mutationFn: async (data: AddCommentType) => {
      let images: Array<{
        key: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
      }> = comment.images.length > 0 ? [{
        key: comment.images[0].key,
        fileName: comment.images[0].fileName,
        mimeType: comment.images[0].mimeType,
        fileSize: comment.images[0].fileSize,
      }] : [];

      // Upload new image if selected
      if (selectedFile) {
        try {
          const uploadedImages = await uploadFiles([selectedFile]);
          if (uploadedImages && uploadedImages.length > 0) {
            images = [uploadedImages[0]];
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Failed to upload image");
        }
      }

      const result = await patchCommentAction(comment.id, {
        content: data.content || "",
        replyId: data.replyId || null,
        images,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      if (comment.replyId) {
        queryClient.invalidateQueries({ queryKey: ["replies", comment.replyId] });
      }
      toast.success("Comment updated");
      onSuccess();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit: SubmitHandler<AddCommentType> = async (data) => {
    if (!data.content || !data.content.trim()) {
      toast.error("Please add content.");
      return;
    }
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {previewUrl && (
        <div className="relative w-20 h-20">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white transition"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <textarea
        placeholder="Edit your comment..."
        maxLength={500}
        className="w-full p-2 rounded-md bg-white dark:bg-black text-black dark:text-white resize-none h-20 outline-none border border-gray-300 dark:border-neutral-700 focus:border-black dark:focus:border-neutral-500 scrollbar-none text-sm"
        {...register("content")}
        disabled={mutation.isPending}
      />

      <div className="flex gap-2 items-center">
        <label className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition text-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={mutation.isPending}
            className="hidden"
          />
          📷
        </label>

        <button
          type="submit"
          disabled={mutation.isPending || !content.trim()}
          className="px-3 py-1 rounded bg-blue-400 text-white text-sm disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-neutral-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
