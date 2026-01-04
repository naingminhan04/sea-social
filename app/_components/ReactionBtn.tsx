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
  LIKE: "hover:bg-blue-500",
  HAHA: "hover:bg-yellow-500",
  WOW: "hover:bg-purple-500",
  SAD: "hover:bg-indigo-500",
  ANGRY: "hover:bg-red-500",
  LOVE: "hover:bg-red-500",
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
              if (p.stats?.reactions?.[rxKeyPrev] != null)
                p.stats.reactions[rxKeyPrev] = Math.max(0, p.stats.reactions[rxKeyPrev] - 1);
            } else {
              p.stats.reactions.total = (p.stats.reactions.total || 0) + 1;
            }

            const rxKeyNew = reaction.toLowerCase() as keyof typeof p.stats.reactions;
            if (p.stats?.reactions?.[rxKeyNew] != null) p.stats.reactions[rxKeyNew] = (p.stats.reactions[rxKeyNew] || 0) + 1;

            p.isReacted = true;
            p.reaction = { id: "optimistic", reactionType: reaction } as { id: string; reactionType: ReactionType };
          }
        }
      }

      queryClient.setQueryData(["posts"], newData);
      setReactionState(reaction); 
      queryClient.invalidateQueries({ queryKey: ["post-reactions", post.id], exact: false });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["posts"], context.previous);
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
            const prevKey = p.reaction.reactionType.toLowerCase() as keyof typeof p.stats.reactions;
            if (p.stats?.reactions?.[prevKey] != null) p.stats.reactions[prevKey] = Math.max(0, p.stats.reactions[prevKey] - 1);
            p.stats.reactions.total = Math.max(0, (p.stats.reactions.total || 1) - 1);
            p.isReacted = false;
            p.reaction = null;
          }
        }
      }

      queryClient.setQueryData(["posts"], newData);
      setReactionState(null);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["posts"], context.previous);
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

  const handleRemove = () => {
    removeMutation.mutate(post.id);
  };

  const userHasReacted = reactionState !== null;

  return (
    <>
      <div className="flex items-center hover:text-white active:scale-[0.9] transition-all">
        {userHasReacted ? (
          <button
            onClick={handleRemove}
            className="flex items-center justify-center w-full h-full gap-2 cursor-pointer"
            aria-label={reactionState ? `${reactionState} reaction` : "reaction"}
          >
            <Image src={reactionImageMap[reactionState!]} alt={reactionState!} width={20} height={20} />
            {post.stats.reactions.total > 0 && <span>{formatCount(post.stats.reactions.total)}</span>}
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center w-full h-full gap-2 cursor-pointer"
            aria-label="Like"
          >
            <ThumbsUp size={18} />
            {post.stats.reactions.total > 0 && <span>{formatCount(post.stats.reactions.total)}</span>}
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="absolute inset-0 z-50 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-60 bg-black text-white p-2">
            <div className="flex-col w-full">
              <div className="flex flex-col justify-center items-center gap-1 my-3">
                <Heart size={30} fill="white" />
                <h1 className="text-xl">Choose Reaction</h1>
                <p className="text-xs text-gray-400">Express how you feel about the post</p>
              </div>
              <div className="flex w-full">
                {Object.values(ReactionType).map((reaction) => {
                  const isUserReaction = reaction === reactionState;
                  return (
                    <span
                      key={reaction}
                      onClick={() => handleReaction(reaction)}
                      className={`bg-neutral-800 rounded-2xl mx-1 sm:mx-3 w-1/5 h-15 flex justify-center items-center cursor-pointer ${
                        reactionHoverMap[reaction]
                      } ${isUserReaction ? "ring-2 ring-white" : ""} transition-colors duration-150`}
                    >
                      <Image src={reactionImageMap[reaction]} alt={reaction} width={28} height={28} />
                    </span>
                  );
                })}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-3 w-full mt-6 bg-neutral-100 cursor-pointer text-black text-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReactionBtn;
