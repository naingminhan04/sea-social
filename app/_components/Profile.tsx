"use client";

import { getUserAction } from "../_actions/user";
import { useQuery } from "@tanstack/react-query";
import { ArrowBigLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Profile = ({ userId }: { userId: string }) => {
  const router = useRouter();

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
    enabled: !!userId,
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
        </div>
      </div>
      <section className="text-clip p-2 break-all text-black dark:text-white">
        {user?.name}
        {user?.accountStatus}
        {user?.bio}
        {user?.username}
        {user?.nickname}
        {user?.phone}
        {user?.points}
        {user?.profilePic}
        {user?.role}
        {user?.createdAt}
        {user?.updatedAt}
        {user?.id}
        {user?.isVerified}
        {user?.email}
        {user?._count.posts}
        {user?._count.followings}
        {user?._count.followers}
        {user?._count.likes}
      </section>
    </main>
  );
};

export default Profile;
