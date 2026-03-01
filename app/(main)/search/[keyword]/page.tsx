"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PostCard from "@/app/_components/PostCard";
import DummyPostCard from "@/app/_components/DummyPostCard";
import { searchAction } from "@/app/_actions/search";
import { PostType } from "@/types/post";

const INITIAL_LIMIT = 5;
const LIMIT_STEP = 5;
const textOrder = [2, 2, 1];
const imageOrder = [3, 1, 4];

type SearchTab = "posts" | "users";

const SearchPage = () => {
  const params = useParams<{ keyword: string }>();
  const routeKeyword = Array.isArray(params.keyword)
    ? params.keyword[0]
    : params.keyword;
  const keyword = useMemo(() => routeKeyword?.trim() ?? "", [routeKeyword]);

  if (!keyword) {
    return (
      <main className="min-h-[calc(100dvh-60px)] lg:min-h-dvh bg-white dark:bg-neutral-900 p-4 text-gray-500 dark:text-gray-400">
        Invalid search keyword.
      </main>
    );
  }

  return <SearchResults key={keyword} keyword={keyword} />;
};

const SearchResults = ({ keyword }: { keyword: string }) => {
  const [activeTab, setActiveTab] = useState<SearchTab>("posts");
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["search", keyword, limit],
    queryFn: async () => {
      const result = await searchAction(keyword, limit);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!keyword,
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  });

  const hasMorePosts = useMemo(() => {
    if (!data) return false;
    return data.posts.length < data.totalPosts;
  }, [data]);

  const hasMoreUsers = useMemo(() => {
    if (!data) return false;
    return data.users.length < data.totalUsers;
  }, [data]);

  const canLoadMore = activeTab === "posts" ? hasMorePosts : hasMoreUsers;

  useEffect(() => {
    if (!loadMoreRef.current || !canLoadMore || isFetching || !keyword) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimit((prev) => prev + LIMIT_STEP);
        }
      },
      { root: null, rootMargin: "120px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [canLoadMore, isFetching, keyword]);

  const posts = data?.posts ?? [];
  const users = data?.users ?? [];
  const showInitialLoading = isLoading && !!keyword;
  const showLoadingMore = isFetching && !isLoading && canLoadMore;

  return (
    <main className="min-h-[calc(100dvh-60px)] md:px-2 lg:min-h-dvh">
      <div className="sticky top-15 lg:top-0 z-20 p-2 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-neutral-950 dark:to-neutral-900 border-b border-blue-200/80 dark:border-neutral-800">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-blue-200/90 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/90 px-2 py-1.5 backdrop-blur">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate">
            Results for &quot;{keyword}&quot;
          </p>
          <div className="flex items-center rounded-lg border border-blue-200 dark:border-neutral-700 bg-blue-50 dark:bg-neutral-950 p-0.5 shrink-0">
          <button
            onClick={() => setActiveTab("posts")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              activeTab === "posts"
                  ? "bg-blue-500 text-white shadow-sm dark:bg-black"
                  : " hover:bg-blue-100 dark:bg-neutral-800 dark:hover:bg-neutral-900"
            }`}
          >
            Posts ({data?.totalPosts ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("users")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              activeTab === "users"
                  ? "bg-blue-500 text-white shadow-sm dark:bg-black"
                  : " hover:bg-blue-100 dark:bg-neutral-800 dark:hover:bg-neutral-900"
            }`}
          >
            Users ({data?.totalUsers ?? 0})
          </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-4 text-red-600 dark:text-red-400">
          {(error as Error).message}
        </div>
      ) : activeTab === "posts" ? (
        <div className="flex flex-col gap-2 pt-2">
          {showInitialLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <DummyPostCard key={i} text={textOrder[i]} image={imageOrder[i]} />
            ))
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 p-4">
              No posts found
            </p>
          ) : (
            posts.map((post: PostType) => (
              <PostCard key={post.id} post={post} view={false} />
            ))
          )}

          {canLoadMore && <div ref={loadMoreRef} className="h-2 w-full" />}

          {showLoadingMore && <DummyPostCard text={2} image={1} />}
        </div>
      ) : (
        <div className="p-2 bg-white dark:bg-neutral-900">
          {showInitialLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-neutral-800"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-neutral-700" />
                  <div className="space-y-2">
                    <div className="w-30 h-3 rounded bg-gray-300 dark:bg-neutral-700" />
                    <div className="w-24 h-3 rounded bg-gray-300 dark:bg-neutral-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 p-4">
              No users found
            </p>
          ) : (
            users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.username}`}
                className="flex items-center gap-2 p-2 hover:bg-blue-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Image
                  src={user.profilePic || "/default-avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover bg-gray-300 dark:bg-neutral-700"
                  width={40}
                  height={40}
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    @{user.username}
                  </p>
                </div>
              </Link>
            ))
          )}

          {canLoadMore && <div ref={loadMoreRef} className="h-2 w-full" />}

          {showLoadingMore && (
            <div className="flex justify-center py-3 text-sm text-gray-500 dark:text-gray-400">
              Loading more users...
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default SearchPage;
