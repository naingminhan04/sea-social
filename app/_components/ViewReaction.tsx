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
        className="flex items-center cursor-pointer -space-x-2"
      >
        {sortedReactions.slice(0, 3).map((r, i) => (
          <span key={r.key} style={{ zIndex: 10 + i }}>
            <Image src={r.src} alt={r.key} width={18} height={18} />
          </span>
        ))}
      </button>

      {open && (
        <>
          <div
            className="absolute inset-0 z-60 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute z-60 bottom-0 right-0 w-full h-100 bg-black text-white p-5 flex flex-col">
            {/* Header */}
            <div className="flex justify-between pb-3 border-b border-neutral-700">
              <div>
                <h1 className="font-bold text-lg">Reactions</h1>
                <p className="text-gray-500 text-xs">
                  See who reacted to this post
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="bg-neutral-600 hover:bg-neutral-500 px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 pt-3">
              <button
                onClick={() => setActive("ALL")}
                className={`h-10 rounded-xl ${
                  active === "ALL"
                    ? "bg-blue-500"
                    : "bg-neutral-700 hover:bg-neutral-600"
                }`}
              >
                All {stats.total}
              </button>

              {sortedReactions.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setActive(r.type)}
                  className={`h-10 rounded-xl flex items-center justify-center gap-1 ${
                    active === r.type
                      ? "bg-blue-500"
                      : "bg-neutral-700 hover:bg-neutral-600"
                  }`}
                >
                  <Image src={r.src} alt={r.key} width={16} height={16} />
                  <span className="text-sm">{r.count}</span>
                </button>
              ))}
            </div>

            <div className="h-full">
              <ReactionPage postId={post.id} reaction={active} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

/* =========================
   REACTION PAGE
========================= */

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
      queryFn: ({ pageParam = 1 }) =>
        viewReactionAction(
          postId,
          pageParam as number,
          reaction === "ALL" ? undefined : reaction
        ),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  if (isLoading) {
    return <div className="flex justify-center items-center w-full h-full">
        <span className="w-10 h-10 rounded-full border-4 border-white/40 border-t-transparent animate-spin" />
      </div>;
  }

  return (
    <div className="mt-4 space-y-3 min-h-full overflow-scroll scrollbar-none">
      {data?.pages.flatMap((page) =>
        page.reactions.map((r) => (
          <div key={r.id} className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src={r.user.profilePic ?? "/default-avatar.png"}
                alt={r.user.name}
                width={32}
                height={32}
                className="rounded-full"
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
                    className="rounded-full"
                  />
                </span>
              )}
            </div>
            <span>
              {r.user.name}
              {r.user.id === currentUserId && (
                <span className="ml-1 text-xs text-blue-400">(You)</span>
              )}
            </span>
          </div>
        ))
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="text-blue-400 hover:underline"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
};

export default ViewReaction;
