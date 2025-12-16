"use client";

import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import LogOutBtn from "./LogOutBtn";

const MenuBtn = () => {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(false);
      }
    };

    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);
  return (
    <div ref={menuRef} className="md:hidden">
      <button
        onClick={() => setMenu(!menu)}
        className="border rounded-md px-1 cursor-pointer"
      >
        <Menu />
      </button>
      {menu && (
        <div className="absolute top-14 right-0 w-full bg-neutral-900">
          <ul
            onClick={() => setMenu(!menu)}
            className="cursor-pointer flex flex-col"
          >
            <Link className="hover:bg-black p-4" href="/home">
              Home
            </Link>
            <Link className="hover:bg-black p-4" href="/chatroom">
              Chatrooms
            </Link>
            <Link className="hover:bg-black p-4" href="/chat">
              Chat
            </Link>
            <Link className="hover:bg-black p-4" href="/profile">
              Profile
            </Link>
            <li className="hover:bg-red-700 p-4">
              <LogOutBtn />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuBtn;
