"use client";

import { Search } from "lucide-react";
import { getAllUserAction } from "../_actions/user";
import { UserResponseType } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import Link from "next/link";

const LIMIT = 10;

type FormValues = {
  keyword: string;
};

const SearchBtn = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useLockBodyScroll(open);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", keyword],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getAllUserAction(pageParam, LIMIT, keyword);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.metadata.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: open && !!keyword,
  });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: "100px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const value = data.keyword.trim();
    if (!value) return;
    setHasSearched(true);
    setKeyword(value);
  };

  const handleClose = () => {
    setOpen(false);
    setHasSearched(false);
    setKeyword("");
    reset();
  };

  const users: UserResponseType["users"] =
    data?.pages.flatMap((page) => page.users) ?? [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 active:scale-90 flex justify-center items-center transition-all"
      >
        <Search />
      </button>

      {open && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-start p-4 z-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-100 dark:bg-neutral-900 w-full max-w-md p-4 rounded-md"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex justify-center items-center gap-2"
            >
              <input
                type="text"
                autoFocus
                placeholder="Search users"
                className="flex-1 p-2 rounded w-full h-10 bg-white dark:bg-black border border-gray-300 dark:border-neutral-700 focus:border-black dark:focus:border-white"
                {...register("keyword")}
              />
              <button
                type="submit"
                className=" px-4 h-10 bg-blue-300 dark:bg-neutral-700 hover:bg-blue-400 dark:hover:bg-neutral-600 active:bg-blue-400 dark:active:bg-neutral-600 active:scale-90 transition-all rounded"
              >
                <Search />
              </button>
            </form>

            <div
              ref={scrollRef}
              className="max-h-[30vh] overflow-auto scrollbar-none"
            >
              {!hasSearched ? null : isLoading ? (
                <div className="flex justify-center items-center h-30 mt-3">
                  <span className="w-8 h-8 rounded-full border-2 border-black/30 border-t-black dark:border-white/30 dark:border-t animate-spin" />
                </div>
              ) : error ? (
                <p className="text-red-600 dark:text-red-500 mt-3">{(error as Error).message}</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center mt-3">No users found</p>
              ) : (
                users.map((user) => (
                  <Link onClick={handleClose} key={user.id} className="flex items-center gap-2 p-2 hover:bg-blue-200 dark:hover:bg-neutral-800 rounded" href={`/users/${user.username}`}>
                    <Image
                      src={user.profilePic || "/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 bg-gray-300 dark:bg-neutral-400 rounded-full object-cover"
                      width={50}
                      height={50}
                    />
                    <span>{user.name}</span>
                  </Link>
                ))
              )}

              {hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="text-center p-2 text-gray-500 dark:text-gray-400"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : "Scroll to load more"}
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="mt-4 w-full py-2 bg-blue-300 dark:bg-neutral-700 hover:bg-blue-400 dark:hover:bg-neutral-600 active:bg-blue-400 dark:active:bg-neutral-600 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBtn;
