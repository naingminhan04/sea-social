import { Star } from "lucide-react";
import LogOutBtn from "./LogOutBtn";
import MenuBtn from "./MenuBtn";

const NavBar = () => {
  return (
    <header className="bg-black">
      <nav className="flex justify-between items-center p-4">
        <div className="flex gap-1">
          <Star fill="white" />
          <h1>SEA</h1>
        </div>
        <MenuBtn>
          <div className="absolute top-15 right-0 w-full bg-neutral-900">
            <ul className="cursor-pointer gap-3 px-3 py-1 flex flex-col">
              <li>Home</li>
              <li>Chatrooms</li>
              <li>Chat</li>
              <li>Profile</li>
              <LogOutBtn />
            </ul>
          </div>
        </MenuBtn>
      </nav>
    </header>
  );
};

export default NavBar;
