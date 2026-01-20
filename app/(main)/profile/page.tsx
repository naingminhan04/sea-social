'use client'

import Profile from "@/app/_components/Profile";
import { useAuthStore } from "@/store/auth";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id as string;  

  return (
    <main className="p-2 lg:pt-0">
      <Profile userId={userId}/>
    </main>
  );
};

export default ProfilePage;
