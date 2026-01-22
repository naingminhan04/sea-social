"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogOutBtn from "./LogOutBtn";

export const MenuArr = [
  {
    name: "Home",
    href: "/home",
  },
  {
    name: "Chatrooms",
    href: "/chatroom",
  },
  {
    name: "Chat",
    href: "/chat",
  },
  {
    name: "Profile",
    href: "/profile",
  },
];
const SideBar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block w-9/10">
      <ul className="cursor-pointer flex w-full flex-col">
        {MenuArr.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              className={`p-4 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-400 dark:bg-black"
                  : "hover:bg-blue-300 dark:hover:bg-neutral-950 active:bg-blue-400 dark:active:bg-black"
              }`}
              href={item.href}
            >
              {item.name}
            </Link>
          );
        })}
        <li className="dark:hover:bg-red-800 dark:active:bg-red-700 hover:bg-red-400 active:bg-red-500 p-4 rounded-md transition-colors">
          <LogOutBtn />
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
