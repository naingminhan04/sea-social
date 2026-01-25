"use client";

import { getUserAction } from "../_actions/user";
import { useQuery } from "@tanstack/react-query";
import { ArrowBigLeft, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import PostReel from "./PostReel";

const Profile = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const viewer = useAuthStore((state) => state.user);
  const viewerId = viewer?.id;
  const viewerUsername = viewer?.username;

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const result = await getUserAction(userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center lg:h-dvh h-[calc(100dvh-60px)]">
        <span className="w-8 h-8 rounded-full border-2 border-black/30 border-t-black dark:border-white/30 dark:border-t-white animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center lg:h-dvh h-[calc(100dvh-60px)]">
        Error{error.message}{" "}
        <button onClick={() => refetch()}>Retry</button>{" "}
      </div>
    );

  return (
    <main className="bg-white relative text-sm sm:text-base dark:bg-neutral-900 lg:min-h-dvh min-h-[calc(100dvh-60px)]">
      <div className="flex w-full sticky top-15 bg-white dark:bg-neutral-900 lg:top-0 z-10 items-center gap-1 h-12 lg:h-15 font-semibold">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <ArrowBigLeft fill="black" className="dark:fill-white" />{" "}
        </button>
        <span className="text-black dark:text-white">{`${user?.name}'s Profile`}</span>
      </div>
      <div className="relative mb-[10vw] md:mb-[6vw] lg:mb-[clamp(10px,5vw,60px)]">
        <div className="w-full aspect-5/2 relative bg-gray-300 dark:bg-neutral-400">
          {user?.coverPic ? (
            <Image
              src={user?.coverPic}
              fill
              alt="Cover Picture"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="absolute w-3/14 -bottom-2/9 left-1/10">
          <Image
            src={user?.profilePic || "/default-avatar.png"}
            alt="Profile Picture"
            width={200}
            height={200}
            className="object-cover border-[1vw] md:border-[0.6vw] lg:border-[clamp(5px,1vw,7px)] border-white dark:border-neutral-900 bg-gray-300 w-full aspect-square relative rounded-full"
          />
          <span
            className={`absolute bottom-1/10 right-1/10 border w-[3vw] md:w-[1.8vw] lg:w-[clamp(17px,3vw,1px)] aspect-square ${user?.accountStatus ? "bg-green-500" : "bg-gray-500"} rounded-full`}
          ></span>
        </div>
      </div>
      <section className="px-4 pb-5 space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="font-semibold flex items-center text-[6vw] md:text-[3.5vw] lg:text-[clamp(20px,3.5vw,30px)] text-black dark:text-white">
              {user?.name}
              {user?.role === "ADMIN" && (
                <span
                  onClick={() => {
                    toast("This User is An Admin", {
                      icon: (
                        <ShieldCheck className="text-blue-500 dark:text-green-400" />
                      ),
                      id: "admin",
                      duration: 2000,
                    });
                  }}
                  className="ml-1 text-blue-500 dark:text-green-400"
                >
                  <ShieldCheck className="w-[6vw] md:w-[3.5vw] lg:w-[clamp(20px,3.5vw,30px)] h-[6vw] md:h-[3.5vw] lg:h-[clamp(20px,3.5vw,30px)]" />
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-[4vw] md:text-[2.5vw] lg:text-[clamp(15px,2.5vw,18px)]">
              @{user?.username}
            </p>
          </div>
          <div className="rounded-lg ring ring-neutral-200 dark:ring-neutral-800 p-3 flex justify-center items-center  gap-2 transition-all duration-300">
            <p className="text-xs text-gray-600 dark:text-gray-400">Points</p>
            <p className="text-sm">{user?.points}</p>
          </div>
        </div>

        {user?.bio && (
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-xl">
            {user.bio}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Followers", value: user?._count.followers },
            { label: "Following", value: user?._count.followings },
            { label: "Posts", value: user?._count.posts },
            { label: "Likes", value: user?._count.likes },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-black/5 dark:border-white/10 p-4 flex flex-col items-center justify-center bg-black/5 dark:bg-white/3"
            >
              <span className="text-lg font-semibold">{item.value}</span>
              <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {(viewerId === userId || viewerUsername === userId) && (
            <div className="grid grid-cols-2 gap-3">
              {user?.email && (
                <div className="rounded-lg border border-black/5 dark:border-white/10 p-3">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm break-all">{user.email}</p>
                </div>
              )}

              {user?.phone && (
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-3">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm">{user.phone}</p>
                </div>
              )}

              {user?.createdAt && (
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-3">
                  <p className="text-xs text-gray-400">Account Created At</p>
                  <p className="text-sm">{formatDate(user.createdAt)}</p>
                </div>
              )}
              {user?.updatedAt && (
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-3">
                  <p className="text-xs text-gray-400">Account Updated At</p>
                  <p className="text-sm">{formatDate(user.updatedAt)}</p>
                </div>
              )}
            </div>
          )}
      </section>

      <section className="bg-neutral-100 dark:bg-neutral-950 p-2 md:px-0">
        <PostReel userId={user?.id} />
      </section>
    </main>
  );
};

export default Profile;
