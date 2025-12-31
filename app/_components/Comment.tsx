"use client";

import { PostType } from "@/types/post";
import { MessageCircle } from "lucide-react";
import { formatCount } from "./PostCard";
import { useState } from "react";
import { getCommentAction } from "../_actions/comment";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CommentResponseType } from "@/types/comment";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";


const CommentBtn = ({ post }: { post: PostType }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 cursor-pointer hover:text-white"
      >
        <MessageCircle size={18} />
        {post.stats.comments > 0 && (
          <span>{formatCount(post.stats.comments)}</span>
        )}
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-60 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed md:absolute bottom-0 left-0 right-0 top-0 z-60 bg-black overflow-hidden text-white">
            <div className="flex-col w-full h-dvh overflow-scroll scrollbar-none">
              <div className="flex w-full p-5 justify-between pb-3 border-b border-neutral-700 sticky top-0 bg-black">
                <div>
                  <h1 className="font-bold text-lg">Comments</h1>
                  <p className="text-gray-500 text-xs">
                    See who commented to this post
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-neutral-600 hover:bg-neutral-500 px-4 py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
              <CommentPage postId={post.id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CommentBtn;

const CommentPage = ({ postId }: { postId: string }) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<CommentResponseType>({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) =>
      getCommentAction(postId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-dvh">
        <span className="w-10 h-10 rounded-full border-4 border-white/40 border-t-transparent animate-spin" />
      </div>
    );
  }

  const comments =
    data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className="flex flex-col">
      <main className="px-5 py-3 space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-400 text-center">
            No comments yet
          </p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Image
                width={10}
                height={10}
              src={comment.user.profilePic || "/default-avatar.png"}
              alt={comment.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-col">
              <div className="bg-neutral-800 rounded-xl px-4 py-2 max-w-[85%] wrap-break-word whitespace-normal">

                <p className="font-semibold text-sm">
                  {comment.user.name}
                </p>
                <p className="text-sm text-gray-200">
                  {comment.content}
                </p>
              </div>

              <div className="flex gap-4 text-xs text-gray-400 mt-1 px-2">
                <span>
                  {formatDate(comment.createdAt)}
                </span>
                <span>{comment.stats.replies} replies</span>
                <span>{comment.stats.reactions.total} reactions</span>
              </div>
            </div>
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
};

