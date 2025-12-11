'use client'

import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"

const Home = () => {
  const user = useAuthStore((state) => state.user)
  const router = useRouter();
  if (!user) {
    router.replace('/')
  }
  return (
    <div>
      Home
    </div>
  )
}

export default Home
