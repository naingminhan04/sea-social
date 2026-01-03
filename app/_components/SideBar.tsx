import Link from "next/link";
import LogOutBtn from "./LogOutBtn";

const Menu = [{
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
  return (
    <div className="hidden lg:flex w-9/10">
      <ul className="cursor-pointer flex w-full flex-col">
        {Menu.map((item) => (
          <Link
            key={item.name}
            className="hover:bg-black p-4 rounded-2xl"
            href={item.href}
          >
            {item.name}
          </Link>
        ))}
        <li className="hover:bg-red-700 p-4 rounded-2xl">
          <LogOutBtn />
        </li>
      </ul>
    </div>
  );
};

export default SideBar;