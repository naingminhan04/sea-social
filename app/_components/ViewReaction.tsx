"use client";

import Image from "next/image";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { viewReactionAction } from "../_actions/reaction";
import {
  PostType,
  ReactionType,
  ReactionCountType,
  PostReactionType,
} from "@/types/post";
import { useAuthStore } from "@/store/auth";

type ReactionFilter = ReactionType | "ALL";

const REACTIONS: {
  key: Exclude<keyof ReactionCountType, "total">;
  type: ReactionType;
  src: string;
}[] = [
  { key: "like", type: ReactionType.like, src: "/like.png" },
  { key: "love", type: ReactionType.love, src: "/love.png" },
  { key: "wow", type: ReactionType.wow, src: "/wow.png" },
  { key: "haha", type: ReactionType.haha, src: "/haha.png" },
  { key: "angry", type: ReactionType.angry, src: "/angry.png" },
  { key: "sad", type: ReactionType.sad, src: "/sad.png" },
];

const ViewReaction = ({ post }: { post: PostType }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ReactionFilter>("ALL");
  

  const stats = post.stats.reactions;

  const sortedReactions = REACTIONS.map((r) => ({
    ...r,
    count: stats[r.key],
  }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center h-10 px-2 rounded-xl hover:bg-blue-300 active:bg-blue-300 dark:hover:bg-neutral-500  dark:active:bg-neutral-500  hover:text-neutral-900 dark:hover:text-neutral-100  -space-x-0.5 transition active:scale-90 ${stats.total === 0 && "hidden"}`}
      >
        {sortedReactions.slice(0, 3).map((r, i) => (
          <span
            key={r.key}
            style={{ zIndex: 3 - i }}
            className="rounded-full ring-1 ring-neutral-900"
          >
            <Image src={r.src} alt={r.key} width={18} height={18} />
          </span>
        ))}
      </button>

      {open && (
        <>
          <div
            className="fixed overscroll-contain overflow-hidden inset-0 z-60 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="fixed overscroll-contain overflow-hidden md:max-w-xl mx-auto z-60 bottom-0 md:bottom-1/2 md:translate-y-1/2 md:rounded-xl right-0 left-0 w-full h-100 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-5 flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-neutral-800">
              <div>
                <h1 className="font-semibold text-lg">Reactions</h1>
                <p className="text-gray-500 text-xs">
                  See who reacted to this post
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-full bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 active:scale-90 transition"
              >
                Close
              </button>
            </div>

            <div className="flex overflow-x-scroll overflow-y-hidden scrollbar-none gap-2 pt-4">
              <button
                onClick={() => setActive("ALL")}
                className={`h-10 mx-1 shrink-0 rounded-xl w-15 text-sm font-medium transition ${
                  active === "ALL"
                    ? "bg-blue-300 dark:bg-black scale-110"
                    : "bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700"
                }`}
              >
                All {stats.total}
              </button>

              {sortedReactions.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setActive(r.type)}
                  className={`h-10 mx-1 shrink-0 rounded-xl w-15 flex items-center justify-center gap-1 text-sm transition ${
                    active === r.type
                      ? "bg-blue-300 dark:bg-black scale-110"
                      : "bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  <Image src={r.src} alt={r.key} width={16} height={16} />
                  <span>{r.count}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 mt-2 overflow-y-scroll overscroll-contain scrollbar-none">
              <ReactionPage postId={post.id} reaction={active} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

const ReactionPage = ({
  postId,
  reaction,
}: {
  postId: string;
  reaction: ReactionFilter;
}) => {
  const auth = useAuthStore();
  const currentUserId = auth.user?.id;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<PostReactionType>({
      queryKey: ["post-reactions", postId, reaction],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await viewReactionAction(
          postId,
          pageParam as number,
          reaction === "ALL" ? undefined : reaction
        );
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="w-8 h-8 rounded-full border-2 border-black/30 border-t-black dark:border-white/30 dark:border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {data?.pages.flatMap((page) =>
        page.reactions.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-neutral-200 active:bg-neutral-200 dark:hover:bg-neutral-950 dark:active:bg-neutral-950 transition-all"
          >
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src={r.user.profilePic ?? "/default-avatar.png"}
                alt={r.user.name}
                fill
                className="rounded-full object-cover bg-gray-300"
              />
              {r.reactionType && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4">
                  <Image
                    src={
                      REACTIONS.find((rx) => rx.type === r.reactionType)?.src ??
                      "/like.png"
                    }
                    alt={r.reactionType}
                    width={16}
                    height={16}
                  />
                </span>
              )}
            </div>

            <span className="text-sm">
              {r.user.name}
            </span>
          </div>
        ))
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto block text-sm text-blue-400 hover:underline"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
};

export default ViewReaction;
