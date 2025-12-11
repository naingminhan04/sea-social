'use client'

import { Menu } from "lucide-react";
import { Star } from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const [ menu , setMenu] = useState(false)

  return (
    <header className="bg-black">
      <nav className="flex justify-between items-center p-4">
        <div className="flex gap-1">
            <Star fill="white"/><h1>SEA</h1>
        </div>
        <div onClick={() => setMenu(!menu)} className="border rounded-md px-1">
          <Menu />
        </div>
        {menu && (
          <div className="absolute top-15 right-0 w-full bg-neutral-900">
            <ul className="gap-3 p-2 flex flex-col">
              <li>Home</li>
              <li>Chatrooms</li>
              <li>Chat</li>
              <li>Sign-In</li>
              <li></li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
