"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import PostCard from "./PostCard";
import { getAllPostAction } from "../_actions/postAction";
import { PostType } from "@/types/post";
import DummyPostCard from "./DummyPostCard";
import toast from "react-hot-toast";

const LIMIT = 10;

const PostReel = ( {userId}: {userId?: string} ) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", userId ?? "all"],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getAllPostAction(pageParam, LIMIT, userId);
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
    initialPageParam: 1,
  });

  const handleRefresh = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if(!userId) {
      toast.promise(refetch(), {
      loading: "Refreshing the feed",
      success: "Feed updated!",
      error: "Error refreshing feed",
    });
    }
  };

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "5000px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-2 lg:h-dvh h-[calc(100dvh-60px)] overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <DummyPostCard key={i} text={2 + (i % 3)} image={3 + (i % 4)} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className=" w-full h-[calc(100dvh-60px)] lg:h-dvh">
        <div className="bg-white dark:bg-neutral-900 flex flex-col justify-center items-center gap-4 w-full h-full">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-lg font-semibold mb-2">Failed to load posts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {error.message}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-400 dark:bg-black active:scale-95 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="flex flex-col w-full gap-2 overscroll-none">
      {posts.length === 0 && !isLoading ? (
        <div className="flex flex-col justify-center items-center w-full h-full p-4">
          <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
        </div>
      ) : (
        <>
          {posts.map((post: PostType) => (
            <PostCard key={post.id} post={post} view={false} />
          ))}

          {hasNextPage ? (
            <div
              ref={loadMoreRef}
              className={`h-10 flex justify-center items-center ${isFetchingNextPage && "w-full h-auto"}`}
            >
              {isFetchingNextPage && <DummyPostCard text={2} image={1} />}
            </div>
          ) : (
            <div className="flex w-full justify-between items-center p-2 bg-white dark:bg-neutral-900 text-gray-500 dark:text-gray-400 text-sm">
              <span>You have reached the end</span>{" "}
              <button
                onClick={handleRefresh}
                className="bg-blue-400 dark:bg-white active:scale-98 transition-all text-neutral-50 dark:text-black rounded-md p-2"
              >
                {userId ? "Scroll to top" : "Refresh the feed"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostReel;
