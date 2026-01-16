"use client";

import { Search } from "lucide-react";
import { getAllUserAction } from "../_actions/user";
import { UserResponseType } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const LIMIT = 10;

type FormValues = {
  keyword: string;
};

const SearchBtn = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { register, handleSubmit } = useForm<FormValues>();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useLockBodyScroll(open)

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
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
  });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setKeyword(data.keyword.trim() || "a");
    refetch();
  };

  const users: UserResponseType["users"] = data?.pages.flatMap((page) => page.users) ?? [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded hover:bg-gray-700 active:bg-gray-600"
      >
        <Search />
      </button>

      {open && (
        <div onClick={()=>setOpen(false)} className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-start p-4 z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-neutral-900 w-full max-w-md p-4 rounded-md">
            <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center gap-2">
              <input
                type="text"
                placeholder="Search users"
                className="flex-1 p-2 rounded w-full h-10 bg-black text-white border border-neutral-700 focus:border-white"
                {...register("keyword")}
              />
              <button
                type="submit"
                className=" px-4 h-10 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 active:scale-90 transition-all rounded text-white"
              >
                <Search />
              </button>
            </form>

            <div className="mt-4 max-h-[30vh] overflow-auto scrollbar-none">
              {isLoading ? (
                <p className="text-gray-400">Loading users...</p>
              ) : error ? (
                <p className="text-red-500">{(error as Error).message}</p>
              ) : users.length === 0 ? (
                <p className="text-gray-400">No users found</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-800 rounded"
                  >
                    <Image src={user.profilePic || "/default-avatar.png"} alt="" className="w-8 h-8 rounded-full object-cover" width={50} height={50}/>
                    <span>{user.name}</span>
                  </div>
                ))
              )}

              {hasNextPage && (
                <div ref={loadMoreRef} className="text-center p-2 text-gray-400">
                  {isFetchingNextPage ? "Loading more..." : "Scroll to load more"}
                </div>
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 rounded text-white"
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
