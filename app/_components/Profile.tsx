'use client'

import { getUserAction } from "../_actions/user"
import { useQuery } from "@tanstack/react-query"
import { ArrowBigLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { useRouter } from "next/navigation"

const Profile = ({userId}:{userId:string}) => {
  const router = useRouter();

    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const result = await getUserAction(userId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        enabled: !!userId

    })

    if (isLoading) return <div>Loading</div>
    if (error) return <div>Error{error.message} <button onClick={()=>refetch()}>Retry</button> </div>

  return (
    <main>
      <header className="relative mb-[10vw] md:mb-[6vw] lg:mb-[clamp(10px,5vw,60px)]">
        <div className="flex items-center gap-1 bg-white dark:bg-black h-15 font-semibold">
          <button onClick={()=>router.back()} className="p-2 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600"><ArrowBigLeft fill="black" className="dark:fill-white"/> </button>
          <span className="text-black dark:text-white">{`${user?.name}'s Profile`}</span>
        </div>
        <div className="w-full aspect-5/2 relative bg-gray-300 dark:bg-neutral-400">
          {user?.coverPic ? <Image 
          src={user?.coverPic}
          fill
          alt="Cover Picture"
          className="object-cover"
        /> : null}
        </div>
        <div className="absolute w-3/14 -bottom-2/9 left-1/10">
          <Image 
            src={user?.profilePic || "/default-avatar.png"}
            alt="Profile Picture"
            width={200}
            height={200}
            className="object-cover border-6 border-white dark:border-neutral-950 bg-gray-300 w-full aspect-square relative rounded-full"
          />
        </div>
      </header>
      <section className="text-clip break-all text-black dark:text-white">
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
  )
}

export default Profile
