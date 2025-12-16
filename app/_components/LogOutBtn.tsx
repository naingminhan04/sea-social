'use client'

import { clearCookies } from "../_actions/cookies";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function LogOutBtn() {
  const clearUser = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogOut = async() => {
    await clearCookies();
    clearUser();
    router.replace("/");
  };

  return <div onClick={handleLogOut}>Log-Out</div>;
}
