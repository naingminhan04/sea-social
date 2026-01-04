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

const CommentBtn = ({ post }: { post: PostType }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 cursor-pointer hover:text-white active:scale-[0.9] transition-all"
      >
        <MessageCircle size={18} />
        {post.stats.comments > 0 && (
          <span>{formatCount(post.stats.comments)}</span>
        )}
      </div>

      {open && (
        <>
          <div
            className="absolute inset-0 z-60 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed md:absolute bottom-0 left-0 right-0 lg:top-0 z-60 bg-black overflow-hidden text-white">
            <div className="flex flex-col h-[calc(100dvh-60px)] lg:h-dvh overflow-hidden">
              <div className="flex w-full p-5 justify-between pb-3 border-b z-10 border-neutral-700 sticky top-0 bg-black">
                <div>
                  <h1 className="font-bold text-lg">Comments</h1>
                  <p className="text-gray-500 text-xs">
                    See who commented to this post
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-black bg-white hover:bg-neutral-300 px-4 py-2 rounded-xl"
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
        </>
      )}
    </>
  );
};

export default CommentBtn;

const CommentPage = ({ postId }: { postId: string }) => {
  const auth = useAuthStore();
  const userId = auth.user?.id;
  const queryClient = useQueryClient();
  const [isDel , setIsDel] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error, refetch} =
    useInfiniteQuery<CommentResponseType>({
      queryKey: ["comments", postId],
      queryFn: ({ pageParam = 1 }) =>
        getCommentAction(postId, pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: 1000,
    });

  const handleDelete = (commentId: string) => {
    setIsDel(true);
    deleteCommentAction(commentId);
    queryClient
      .invalidateQueries({ queryKey: ["comments", postId] })
      .then(() => toast.success("Comment Deleted Successfully"));
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <span className="w-10 h-10 rounded-full border-4 border-white/40 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-4 p-4">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">Failed to load comments</p>
          <p className="text-sm text-gray-400">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  if(!error) {
    return (
    <div className="flex flex-col">
      <main className="px-5 py-3 space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-400 text-center">No comments yet</p>
        )}

        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex gap-3">
              <Image
                width={10}
                height={10}
                src={comment.user.profilePic || "/default-avatar.png"}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex flex-col max-w-[80%] w-fit">
                  <div className="bg-neutral-800 rounded-xl px-4 py-2 w-fit max-w-full">

                  <p className="font-semibold text-sm">{comment.user.name}</p>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap wrap-break-word">
                    {comment.content}
                  </p>
                </div>

                <div>
                  {comment.images.length > 0 &&
                    comment.images.map((img, i) => (
                      <div key={i}>
                        <Image
                          src={img.url}
                          alt={"comment image"}
                          width={200}
                          height={200}
                          className="rounded-lg mt-2"
                        />
                      </div>
                    ))}
                </div>

                <div className="flex gap-4 text-xs text-gray-400 mt-1 px-2">
                  <span>{formatDate(comment.createdAt)}</span>
                  <span>{comment.stats.replies} replies</span>
                  {userId === comment.user.id && (
                    isDel ? <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-transparent animate-spin"/> :<button
                      className="hover:text-red-500"
                      onClick={() => handleDelete(comment.id)}
                      disabled={isDel}
                    >
                      Delete
                    </button>
                    
                  )}
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
            {isFetchingNextPage ? "Loading..." : "Load more"}
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
    queryFn: () => getReplyAction(commentId),
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

const CommentForm = ({ id, replyId = null }: CommentFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<AddCommentType>({
    defaultValues: { content: "", replyId: replyId ?? null, images: [] },
  });
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: (data: AddCommentType) =>
      addCommentAction(
        {
          content: data.content || "",
          replyId: data.replyId ?? replyId ?? null,
          images: data.images ?? [],
        },
        id
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (replyId) {
        queryClient.invalidateQueries({ queryKey: ["replies", replyId] });
      }
      toast.success(replyId ? "Reply posted" : "Comment posted");
      reset();
      setContent("");
    },
    onError: (error: Error) => toast.error(`Failed to post: ${error.message}`),
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

  const isDisabled = mutation.isPending || content.trim() === "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full sticky z-10 bottom-0 right-0 p-4 bg-black"
    >
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex relative">
          <textarea
            placeholder={replyId ? "Write a reply" : "Write a comment"}
            maxLength={500}
            className="w-full scrollbar-none p-2 rounded-md bg-black text-white resize-none h-10 outline-0 border border-neutral-700 focus:border-white"
            {...register("content", {
              onChange: (e) =>
                setContent((e.target as HTMLTextAreaElement).value),
            })}
            disabled={mutation.isPending}
          />
          {content.length > 450 && (
            <div className="text-xs absolute bottom-3 right-1 text-neutral-400 mt-1">
              {content.length}/500
            </div>
          )}
        </div>

        {isDisabled ? <></> :<div className="flex flex-col justify-start">
           <button
            type="submit"
            disabled={isDisabled}
            className="px-3 py-1 h-10 rounded bg-white hover:bg-neutral-300 text-black"
          >
             <SendHorizonal />
          </button>
        </div>}
      </div>
    </form>
  );
};
