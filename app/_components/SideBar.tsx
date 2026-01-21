"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogOutBtn from "./LogOutBtn";

export const MenuArr = [{
  name: "Home",
  href: "/home",
}, {
  name: "Chatrooms",
  href: "/chatroom",
}, {
  name: "Chat",
  href: "/chat",
}, {
  name: "Profile",
  href: "/profile",
}]
const SideBar = () => {
  const pathname = usePathname();
  
  return (
    <div className="hidden lg:flex w-9/10">
      <ul className="cursor-pointer flex w-full flex-col">
        {MenuArr.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              className={`p-4 rounded-2xl transition-colors ${
                isActive 
                  ? "bg-gray-200 dark:bg-black text-white dark:text-white" 
                  : "hover:bg-gray-100 dark:hover:bg-neutral-950 active:bg-gray-300 dark:active:bg-black"
              }`}
              href={item.href}
            >
              {item.name}
            </Link>
          );
        })}
        <li className="hover:bg-red-800 active:bg-red-700 p-4 rounded-2xl">
          <LogOutBtn />
        </li>
      </ul>
    </div>
  );
};

export default SideBar;