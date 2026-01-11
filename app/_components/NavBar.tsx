import { Star } from "lucide-react";
import MenuBtn from "./MenuBtn";
import SideBar from "./SideBar";
import Link from "next/link";
import AddPostBtn from "./AddPostForm";

const NavBar = () => {
  return (
    <header className="bg-black lg:bg-neutral-900 h-15 lg:h-dvh sticky top-0 left-0 right-0 z-70 lg:z-20 lg:w-2/9 shrink-0">
      <nav className="flex lg:flex-col justify-between items-center p-4 lg:p-0 gap-2">
        <div className="flex gap-1 justify-center items-center lg:hidden">
          <MenuBtn />
          <AddPostBtn state={"nav"} />
        </div>

        <div className="flex lg:justify-between lg:w-full lg:bg-black">
          <Link
            href="/home"
            className="flex gap-1 lg:w-full hover:opacity-90 lg:p-5"
          >
            <Star fill="white" />
            <h1>SEA</h1>
          </Link>
          <div className="hidden lg:flex">
            <AddPostBtn state={"sidebar"} />
          </div>
        </div>

        <SideBar />
      </nav>
    </header>
  );
};

export default NavBar;
