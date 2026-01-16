"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogOutBtn from "./LogOutBtn";
import { MenuArr } from "./SideBar";

const MenuBtn = () => {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  
  return (
    <div className="flex lg:hidden">
      <button
        onClick={() => setMenu(!menu)}
        className="px-1 cursor-pointer hover:opacity-90 active:opacity-80"
      >
        {menu ? <X /> : <Menu />}
      </button>
      {menu && (
        <>
          <div
            className="fixed inset-0 -z-20 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenu(false)}
          />
          <div className="absolute top-16 left-0 h-[calc(100dvh-64px)] w-70 z-20 bg-black">
            <ul
              onClick={() => setMenu(!menu)}
              className="cursor-pointer flex flex-col"
            >
              {MenuArr.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    className={`p-4 transition-all active:scale-[0.98] ${
                      isActive
                        ? "bg-neutral-800 text-white"
                        : "hover:bg-neutral-900 active:bg-neutral-800"
                    }`}
                    href={item.href}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <li className="hover:bg-red-700 p-4">
                <LogOutBtn />
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuBtn;
