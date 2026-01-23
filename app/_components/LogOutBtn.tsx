'use client'

import { clearAuthCookies } from "../_actions/cookies";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "nextjs-toploader/app";

export default function LogOutBtn() {
  const clearUser = useAuthStore((state) => state.logOut);
  const router = useRouter();

  const handleLogOut = async() => {
    await clearAuthCookies();
    clearUser();
    router.replace("/");
  };

  return <div onClick={handleLogOut}>Log-Out</div>;
}
