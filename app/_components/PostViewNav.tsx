"use client"

import { ArrowBigLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserType } from "@/types/user";

const PostViewNav = ({user}: {user: UserType}) => {
    const router = useRouter();
  return (
    <div className="flex w-full text-sm sm:text-base bg-white dark:bg-neutral-900 justify-between h-12 lg:h-15 font-semibold">
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowBigLeft fill="black" className="dark:fill-white" />
          </button>
          <span className="text-black dark:text-white">{`${user.name}'s Post`}</span>
        </div>
      </div>
  )
}

export default PostViewNav
