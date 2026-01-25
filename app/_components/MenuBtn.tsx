"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogOutBtn from "./LogOutBtn";
import { getMenuArr } from "./SideBar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/auth";

const MenuBtn = () => {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const username = user?.username;
  const MenuArr = getMenuArr(username as string);
  
  return (
    <div className="flex lg:hidden">
      <button
        onClick={() => setMenu(!menu)}
        className={
          "rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 " +
          "active:scale-90 flex justify-center items-center transition-all"
        }
      >
        {menu ? <X /> : <Menu />}
      </button>
      {menu && (
        <>
          <div
            className="fixed inset-0 -z-20 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenu(false)}
          />
          <div className="absolute flex flex-col top-15 left-0 h-[calc(100dvh-60px)] w-70 z-20 bg-white dark:bg-neutral-900">
            <ul
              onClick={() => setMenu(!menu)}
              className="cursor-pointer flex flex-col"
            >
              {MenuArr.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    className={`p-4 transition-all active:bg-gray-200 ${isActive
                    ? "bg-gray-300 dark:bg-neutral-800 text-black dark:text-white"
                    : "hover:bg-gray-200 dark:hover:bg-neutral-900 active:bg-gray-300 dark:active:bg-neutral-800"}`}
                    href={item.href}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <li className="hover:bg-red-200 dark:hover:bg-red-700 active:bg-red-400 p-4">
                <LogOutBtn />
              </li>
            </ul>
            <div className="mt-auto flex justify-center bg-blue-100 dark:bg-neutral-800 p-2">
              <ThemeToggle />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuBtn;
