import Link from "next/link";
import LogOutBtn from "./LogOutBtn";
const SideBar = () => {
  return (
    <div className="hidden md:flex w-full bg-neutral-900">
      <ul className="cursor-pointer flex w-full flex-col">
        <Link className="hover:bg-black p-4" href="/home">
          Home
        </Link>
        <Link className="hover:bg-black p-4" href="/chatroom">Chatrooms</Link>
        <Link className="hover:bg-black p-4" href="/chat">Chat</Link>
        <Link className="hover:bg-black p-4" href="/profile">Profile</Link>
        <li className="hover:bg-red-700 p-4">
          <LogOutBtn />
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
