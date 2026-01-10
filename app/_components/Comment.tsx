"use client";

import { PostType } from "@/types/post";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { formatCount } from "./PostCard";
import { useState } from "react";
import {
  addCommentAction,
  getCommentAction,
  deleteCommentAction,
  getReplyAction,
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
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

const CommentBtn = ({ post, view }: { post: PostType; view: boolean }) => {
  const [open, setOpen] = useState(false);
  useLockBodyScroll(open);

  if (view)
    return (
      <div className="flex items-center hover:bg-neutral-500 justify-center px-2 h-10 rounded-xl transition hover:text-white active:text-white active:scale-95">
        <button className="flex gap-1 transition">
          <MessageCircle size={18} />
          {post.stats.comments > 0 && (
            <span>{formatCount(post.stats.comments)}</span>
          )}
        </button>
      </div>
    );

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center hover:bg-neutral-500 justify-center px-2 h-10 rounded-xl transition hover:text-white active:text-white active:scale-95"
      >
        <button className="flex gap-1 transition">
          <MessageCircle size={18} />
          {post.stats.comments > 0 && (
            <span>{formatCount(post.stats.comments)}</span>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed max-w-7xl mx-auto bottom-0 left-0 right-0  z-60 bg-neutral-900 overflow-hidden text-white">
          <div className="flex flex-col h-[calc(100dvh-60px)] lg:h-dvh overflow-hidden">
            <div className="flex w-full p-5 justify-between pb-3 border-b border-neutral-800 z-10 sticky top-0">
              <div>
                <h1 className="font-bold text-lg">Comments</h1>
                <p className="text-gray-500 text-xs">
                  See who commented to this post
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 active:scale-90 transition"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-none">
              <CommentPage postId={post.id} />
            </div>

            <CommentForm id={post.id} />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentBtn;

export const CommentPage = ({ postId }: { postId: string }) => {
  const auth = useAuthStore();
  const userId = auth.user?.id;
  const queryClient = useQueryClient();
  const [isDel, setIsDel] = useState<string[]>([]);

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
        toast.error(result.data.error);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-4 p-4">
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

  if (!error) {
    return (
      <div className="flex flex-col">
        <main className="px-5 py-3 space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-400 text-center">No comments yet</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id}>
              <div
                className={`flex gap-3 ${
                  isDel.includes(comment.id) && "opacity-50 pointer-events-none"
                }`}
              >
                <Image
                  width={8}
                  height={8}
                  src={comment.user.profilePic || "/default-avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />

                <div className="flex flex-col max-w-[80%] w-fit">
                  <div className="rounded-xl w-fit max-w-full space-y-1">
                    <p className="text-neutral-400 text-sm">
                      {comment.user.name}
                      <span className="font-extralight text-xs mx-2 text-gray-300">
                        {formatDate(comment.createdAt, false, true)}
                      </span>
                    </p>
                    <p className="whitespace-pre-wrap wrap-break-word">
                      {comment.content}
                    </p>
                  </div>

                  <div>
                    {comment.images.length > 0 &&
                      comment.images.map((img, i) => (
                        <div key={i}>
                          <Image
                            src={img.url.length > 0 ? img.url : "/alt.png"}
                            alt={"comment image"}
                            width={200}
                            height={200}
                            className="rounded-lg mt-2"
                          />
                        </div>
                      ))}
                  </div>

                  <div className="flex gap-4 text-xs text-gray-400 mt-1">
                    <span>{comment.stats.replies} replies</span>
                    {userId === comment.user.id &&
                      (isDel.includes(comment.id) ? (
                        <span className="w-3 h-3 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                      ) : (
                        <button
                          className="hover:text-red-500 active:text-red-400 transition-colors"
                          onClick={() => handleDelete(comment.id)}
                          disabled={isDel.includes(comment.id)}
                        >
                          Delete
                        </button>
                      ))}
                  </div>
                </div>
              </div>
              {comment._count.replies > 0 && <Replies commentId={comment.id} />}
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
  }
};

const Replies = ({ commentId }: { commentId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const result = await getReplyAction(commentId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <div>Loading</div>;

  const replies = (data?.replies ?? data?.comments ?? []) as CommentType[];

  return (
    <div className="ml-12 mt-2 space-y-3">
      {replies.map((reply: CommentType) => (
        <div key={reply.id} className="flex gap-3">
          <Image
            width={10}
            height={10}
            src={reply.user.profilePic || "/default-avatar.png"}
            alt={reply.user.name}
            className="w-8 h-8 rounded-full object-cover"
          />

          <div className="flex-col max-w-[80%]">
            <div className="bg-neutral-800 rounded-xl px-4 py-2">
              <p className="font-semibold text-sm">{reply.user.name}</p>
              <p className="text-sm text-gray-200 whitespace-pre-wrap wrap-break-word">
                {reply.content}
              </p>
            </div>
            <div className="text-xs text-gray-400 mt-1 px-2">
              {formatDate(reply.createdAt)}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-2"></div>
    </div>
  );
};

type CommentFormProps = { id: string; replyId?: string | null };

export const CommentForm = ({ id, replyId = null }: CommentFormProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<AddCommentType>({
    defaultValues: { content: "", replyId: replyId ?? null, images: [] },
  });

  const content = watch("content");

  const mutation = useMutation({
    mutationFn: async (data: AddCommentType) => {
      const result = await addCommentAction(
        {
          content: data.content || "",
          replyId: data.replyId ?? replyId ?? null,
          images: data.images ?? [],
        },
        id
      );
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (replyId) {
        queryClient.invalidateQueries({ queryKey: ["replies", replyId] });
      }
      toast.success(replyId ? "Reply posted" : "Comment posted");
      reset(); // resets the textarea
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

  const isDisabled = mutation.isPending || !content.trim();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full sticky mt-auto z-10 bottom-0 right-0 p-4 bg-neutral-900 border-t border-neutral-800"
    >
      <div className="flex gap-3 items-center">
        <textarea
          placeholder={replyId ? "Write a reply" : "Write a comment"}
          maxLength={500}
          className="flex-1 p-2 rounded-md bg-black text-white resize-none h-11 outline-none border border-neutral-700 focus:border-neutral-500 scrollbar-none"
          {...register("content")}
          disabled={mutation.isPending}
        />
        {content.length > 450 && (
          <div className="text-xs text-gray-400 absolute right-2 bottom-2">
            {content.length}/500
          </div>
        )}
        {isSubmitting ? (
          <span className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white cursor-progress animate-spin" />
        ) : (
          <button
            type="submit"
            disabled={isDisabled}
            className={`px-3 py-1 h-10 rounded ${
              isDisabled
                ? "bg-neutral-700 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-neutral-300 active:scale-90 transition cursor-pointer"
            }`}
          >
            <SendHorizonal />
          </button>
        )}
      </div>
    </form>
  );
};
