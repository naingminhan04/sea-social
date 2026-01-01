"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import PostCard from "../_components/PostCard";
import { getPostAction } from "../_actions/post";
import { PostType } from "@/types/post";

const LIMIT = 10;

const Posts = () => {
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 1 }) => getPostAction(pageParam, LIMIT),
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
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current,rootMargin: "5000px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <div className="flex justify-center items-center w-full h-[calc(100dvh-60px)] md:h-dvh">
        <span className="w-10 h-10 rounded-full border-4 border-white/40 border-t-transparent animate-spin" />
      </div>
  }

  return (
    <div ref={scrollRef} className="flex flex-col w-full gap-2 md:h-dvh h-[calc(100dvh-60px)] overflow-y-scroll scrollbar-none">
      {data?.pages.map((page) =>
        page.posts.map((post: PostType) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="h-10 flex justify-center items-center"
        >
          {isFetchingNextPage && "Loading more..."}
        </div>
      )}
    </div>
  );
};

export default Posts;
