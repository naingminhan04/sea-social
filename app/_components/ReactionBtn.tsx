"use client";

import { PostType, ReactionType, PostsResponseType } from "@/types/post";
import { addReactionAction, removeReactionAction } from "../_actions/reaction";
import { formatCount } from "./PostCard";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ThumbsUp, Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReactionBtnProps {
  post: PostType;
}

const reactionHoverMap: Record<ReactionType, string> = {
  LIKE: "hover:bg-blue-500/80",
  HAHA: "hover:bg-yellow-400/80",
  WOW: "hover:bg-purple-500/80",
  SAD: "hover:bg-indigo-500/80",
  ANGRY: "hover:bg-red-500/80",
  LOVE: "hover:bg-red-500/80",
};

const reactionImageMap: Record<ReactionType, string> = {
  LIKE: "/like.png",
  HAHA: "/haha.png",
  WOW: "/wow.png",
  SAD: "/sad.png",
  ANGRY: "/angry.png",
  LOVE: "/love.png",
};

const ReactionBtn = ({ post }: ReactionBtnProps) => {
  const [open, setOpen] = useState(false);
  const [reactionState, setReactionState] = useState<ReactionType | null>(
    post.isReacted ? post.reaction?.reactionType || null : null
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const addMutation = useMutation({
    mutationFn: ({ postId, reaction }: { postId: string; reaction: ReactionType }) =>
      addReactionAction(postId, reaction),
    onMutate: async ({ postId, reaction }) => {
      if (removeMutation.isPending) removeMutation.reset();

      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previous = queryClient.getQueryData<{ pages: PostsResponseType[] }>(["posts"]);
      const newData = previous ? structuredClone(previous) : previous;

      if (newData?.pages) {
        for (const page of newData.pages) {
          const p = page.posts.find((x: PostType) => x.id === postId);
          if (p) {
            const prevReaction = p.reaction?.reactionType || null;
            if (prevReaction) {
              const rxKeyPrev = prevReaction.toLowerCase() as keyof typeof p.stats.reactions;
              p.stats.reactions[rxKeyPrev] = Math.max(0, p.stats.reactions[rxKeyPrev] - 1);
            } else {
              p.stats.reactions.total += 1;
            }

            const rxKeyNew = reaction.toLowerCase() as keyof typeof p.stats.reactions;
            p.stats.reactions[rxKeyNew] += 1;

            p.isReacted = true;
            p.reaction = { id: "optimistic", reactionType: reaction };
          }
        }
      }

      queryClient.setQueryData(["posts"], newData);
      setReactionState(reaction);
      queryClient.invalidateQueries({ queryKey: ["post-reactions", post.id], exact: false });
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["posts"], ctx.previous);
      setReactionState(post.isReacted ? post.reaction?.reactionType || null : null);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (postId: string) => removeReactionAction(postId),
    onMutate: async (postId: string) => {
      if (addMutation.isPending) addMutation.reset();

      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previous = queryClient.getQueryData<{ pages: PostsResponseType[] }>(["posts"]);
      const newData = previous ? structuredClone(previous) : previous;

      if (newData?.pages) {
        for (const page of newData.pages) {
          const p = page.posts.find((x: PostType) => x.id === postId);
          if (p && p.reaction) {
            const key = p.reaction.reactionType.toLowerCase() as keyof typeof p.stats.reactions;
            p.stats.reactions[key] = Math.max(0, p.stats.reactions[key] - 1);
            p.stats.reactions.total = Math.max(0, p.stats.reactions.total - 1);
            p.isReacted = false;
            p.reaction = null;
          }
        }
      }

      queryClient.setQueryData(["posts"], newData);
      setReactionState(null);
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["posts"], ctx.previous);
      setReactionState(post.isReacted ? post.reaction?.reactionType || null : null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post-reactions", post.id], exact: false });
    },
  });

  const handleReaction = (reaction: ReactionType) => {
    setOpen(false);
    addMutation.mutate({ postId: post.id, reaction });
  };

  const handleRemove = () => removeMutation.mutate(post.id);

  const userHasReacted = reactionState !== null;

  return (
    <>
      <div className="flex items-center transition hover:text-white active:text-white active:scale-90">
        {userHasReacted ? (
          <button
            onClick={handleRemove}
            className="flex gap-1  transition"
          >
            <Image
              src={reactionImageMap[reactionState!]}
              alt={reactionState!}
              width={20}
              height={20}
            />
            {post.stats.reactions.total > 0 && (
              <span className="text-sm">{formatCount(post.stats.reactions.total)}</span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex gap-1  transition"
          >
            <ThumbsUp size={18} />
            {post.stats.reactions.total > 0 && (
              <span className="text-sm">{formatCount(post.stats.reactions.total)}</span>
            )}
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="absolute bottom-0 left-0 right-0 z-60 bg-neutral-900 text-white p-4">
            <div className="flex flex-col items-center gap-1 my-3">
              <Heart size={28} className="text-red-400" />
              <h1 className="text-lg font-semibold">Choose Reaction</h1>
              <p className="text-xs text-neutral-400">
                Express how you feel about the post
              </p>
            </div>

            <div className="flex justify-between px-1">
              {Object.values(ReactionType).map((reaction) => {
                const isActive = reaction === reactionState;
                return (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    className={`flex-1 mx-1 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center transition
                      ${reactionHoverMap[reaction]}
                      ${isActive ? "ring-2 ring-white scale-105" : "hover:scale-105"}
                    `}
                  >
                    <Image
                      src={reactionImageMap[reaction]}
                      alt={reaction}
                      width={28}
                      height={28}
                    />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-xl bg-neutral-100 py-3 text-black font-medium active:scale-98 transition"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ReactionBtn;
