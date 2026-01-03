"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import LogOutBtn from "./LogOutBtn";

const MenuBtn = () => {
  const [menu, setMenu] = useState(false);
  return (
    <div  className="lg:hidden flex">
      <button
        onClick={() => setMenu(!menu)}
        className="px-1 cursor-pointer"
      >
        {menu ? <X /> : <Menu />}
      </button>
      {menu && (
        <>
        <div className="fixed inset-0 -z-20 bg-black/40" onClick={() => setMenu(false)} />
        <div className="absolute top-16 left-0 h-[calc(100dvh-64px)] w-70 z-20 bg-black">
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
        </div></>
      )}
    </div>
  );
};

export default MenuBtn;
