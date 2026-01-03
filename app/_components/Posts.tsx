"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import PostCard from "../_components/PostCard";
import { getPostAction } from "../_actions/post";
import { PostType } from "@/types/post";

const LIMIT = 10;

const Posts = () => {
  
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: async ({ pageParam = 1 }) => await getPostAction(pageParam, LIMIT),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
      initialPageParam: 1,
    });


  const scrollRef = useRef<HTMLDivElement | null>(null);  
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current || !loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  fetchNextPage();
}

      },
      { root: scrollRef.current,rootMargin: "5000px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage,isFetchingNextPage]);

  if (isLoading) {
    return <div className="flex justify-center items-center w-full h-[calc(100dvh-68px)] lg:h-dvh">
        <span className="w-10 h-10 rounded-full border-4 border-white/40 border-t-transparent animate-spin" />
      </div>
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[calc(100dvh-68px)] lg:h-dvh gap-4 p-4">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">Failed to load posts</p>
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

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div ref={scrollRef} className="flex flex-col w-full gap-2 lg:h-dvh h-[calc(100dvh-68px)] overflow-y-scroll scrollbar-none">
      {posts.length === 0 && !isLoading ? (
        <div className="flex flex-col justify-center items-center w-full h-full gap-4 p-4">
          <p className="text-gray-400">No posts yet</p>
        </div>
      ) : (
        <>
          {posts.map((post: PostType) => (
            <PostCard key={post.id} post={post} />
          ))}

          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="h-10 flex justify-center items-center"
            >
              {isFetchingNextPage && (
                <span className="text-gray-400">Loading more...</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;
