import { PostType, ReactionType, PostsResponseType } from "@/types/post";
import { addReactionAction, removeReactionAction } from "../_actions/reaction";
import { ReactNode, useEffect, useState } from "react";
import { ThumbsUp, Heart, Angry, Laugh, Frown } from "lucide-react";
import { FaSurprise } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReactionBtnProps {
  post: PostType;
}

const reactionColorMap: Record<ReactionType, string> = {
  LIKE: "bg-blue-500",
  HAHA: "bg-yellow-500",
  WOW: "bg-purple-500",
  SAD: "bg-indigo-500",
  ANGRY: "bg-red-500",
  LOVE: "bg-red-500",
};

const ReactionBtn = ({ post }: ReactionBtnProps) => {
  const [open, setOpen] = useState(false);

  const [reactionState, setReactionState] = useState<ReactionType | null>(
    post.isReacted ? post.reaction?.reactionType || null : null
  );

  const reactionIconMap: Record<ReactionType, ReactNode> = {
    LIKE: <ThumbsUp />,
    HAHA: <Laugh />,
    WOW: <FaSurprise size={20} />,
    SAD: <Frown />,
    ANGRY: <Angry />,
    LOVE: <Heart />,
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const queryClient = useQueryClient();

  const addMutation = useMutation<
    unknown,
    Error,
    { postId: string; reaction: ReactionType },
    { previous?: { pages: PostsResponseType[] } }
  >({
    mutationFn: ({
      postId,
      reaction,
    }: {
      postId: string;
      reaction: ReactionType;
    }) => addReactionAction(postId, reaction),
    onMutate: async (vars: { postId: string; reaction: ReactionType }) => {
      const { postId, reaction } = vars;
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previous = queryClient.getQueryData<{ pages: PostsResponseType[] }>(
        ["posts"]
      );

      const newData = previous ? structuredClone(previous) : previous;

      if (newData?.pages) {
        for (const page of newData.pages) {
          const p = page.posts.find((x: PostType) => x.id === postId);
          if (p) {
            const prevReaction = p.reaction?.reactionType || null;

            if (prevReaction) {
              const prevKey = prevReaction.toLowerCase();
              const rxKeyPrev = prevKey as keyof typeof p.stats.reactions;
              if (p.stats?.reactions?.[rxKeyPrev] != null) {
                p.stats.reactions[rxKeyPrev] = Math.max(
                  0,
                  p.stats.reactions[rxKeyPrev] - 1
                );
              }
            } else {
              p.stats.reactions.total = (p.stats.reactions.total || 0) + 1;
            }

            const newKey = reaction.toLowerCase();
            const rxKeyNew = newKey as keyof typeof p.stats.reactions;
            if (p.stats?.reactions?.[rxKeyNew] != null) {
              p.stats.reactions[rxKeyNew] =
                (p.stats.reactions[rxKeyNew] || 0) + 1;
            }

            p.isReacted = true;
            p.reaction = { id: "optimistic", reactionType: reaction } as {
              id: string;
              reactionType: ReactionType;
            };
          }
        }
      }

      queryClient.setQueryData(["posts"], newData);

      setReactionState(reaction);

      return { previous };
    },
    onError: (
      err: unknown,
      variables: { postId: string; reaction: ReactionType },
      context: { previous?: { pages: PostsResponseType[] } } | undefined
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts"], context.previous);
      }
      setReactionState(
        post.isReacted ? post.reaction?.reactionType || null : null
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const removeMutation = useMutation<
    unknown,
    Error,
    string,
    { previous?: { pages: PostsResponseType[] } }
  >({
    mutationFn: (postId: string) => removeReactionAction(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previous = queryClient.getQueryData<{ pages: PostsResponseType[] }>(
        ["posts"]
      );

      const newData = previous ? structuredClone(previous) : previous;

      if (newData?.pages) {
        for (const page of newData.pages) {
          const p = page.posts.find((x: PostType) => x.id === postId);
          if (p && p.reaction) {
            const prevReaction = p.reaction.reactionType;
            const prevKey = prevReaction.toLowerCase();
            const rxKeyPrev = prevKey as keyof typeof p.stats.reactions;

            if (p.stats?.reactions?.[rxKeyPrev] != null) {
              p.stats.reactions[rxKeyPrev] = Math.max(
                0,
                p.stats.reactions[rxKeyPrev] - 1
              );
            }

            p.stats.reactions.total = Math.max(
              0,
              (p.stats.reactions.total || 1) - 1
            );

            p.isReacted = false;
            p.reaction = null;
          }
        }
      }

      queryClient.setQueryData(["posts"], newData);

      setReactionState(null);

      return { previous };
    },
    onError: (
      err: unknown,
      variables: string,
      context: { previous?: { pages: PostsResponseType[] } } | undefined
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts"], context.previous);
      }
      setReactionState(
        post.isReacted ? post.reaction?.reactionType || null : null
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

  const isBusy = addMutation.isPending || removeMutation.isPending;

  return (
    <>
      {userHasReacted ? (
        <button
          disabled={isBusy}
          onClick={() => !isBusy && handleRemove()}
          className={`flex items-center justify-center gap-2 w-full h-full cursor-pointer rounded px-2 py-1
            ${
              reactionState
                ? reactionColorMap[reactionState]
                : "bg-gray-200 text-black"
            }
          `}
        >
          {removeMutation.status === "pending" ? (
            "Removing..."
          ) : reactionState ? (
            reactionIconMap[reactionState]
          ) : (
            <ThumbsUp />
          )}
          {reactionState ? "" : "Like"}
        </button>
      ) : (
        <button
          className={`flex items-center justify-center w-full h-full gap-2 'cursor-pointer' rounded px-2 py-1 bg-gray-200 hover:bg-gray-300 transition`}
          disabled={isBusy}
          onClick={() => !isBusy && setOpen(true)}
        >
          {addMutation.isPending ? "..." : <ThumbsUp />}
          Like
        </button>
      )}

      {open && (
        <>
          <div
            className="absolute inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 z-50 bg-black text-white p-2">
            <div className="flex-col w-full h-55">
              <div className="flex flex-col justify-center items-center gap-1 my-3">
                <Heart size={30} fill="white"/>
                <h1 className="text-xl">Choose Reaction</h1>
                <p className="text-xs text-gray-400">Express how you feel about the post</p>
              </div>
              <div className="flex w-full">
                {Object.values(ReactionType).map((reaction) => {
                  const isUserReaction = reaction === reactionState;

                  return (
                    <span
                      key={reaction}
                      onClick={() => !isBusy && handleReaction(reaction)}
                      className={`bg-neutral-800 rounded-2xl mx-1 sm:mx-3 w-1/5 h-15 flex justify-center items-center ${
                        isBusy ? "opacity-70 cursor-wait" : "cursor-pointer"
                      }
                      hover:${reactionColorMap[reaction]} ${
                        isUserReaction ? "ring-2 ring-white" : ""
                      }
                    `}
                    >
                      {addMutation.isPending && reaction === reactionState
                        ? "..."
                        : reactionIconMap[reaction]}
                    </span>
                  );
                })}
              </div>
              <button className="p-3 w-full mt-6 bg-neutral-100 text-black text-lg">Cancel</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReactionBtn;
