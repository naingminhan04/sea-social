import { Star } from "lucide-react";
import MenuBtn from "./MenuBtn";
import SideBar from "./SideBar";
import Link from "next/link";

const NavBar = () => {
  return (
    <header className="bg-black lg:bg-neutral-900 h-15 lg:h-dvh sticky top-0 left-0 right-0 z-70 lg:z-0 lg:w-2/9 shrink-0">
      <nav className="flex lg:flex-col justify-between items-center p-4 lg:p-0 gap-2">
        <MenuBtn />
        <Link href="/home" className="flex gap-1 lg:w-full lg:bg-black hover:opacity-90 lg:p-5">
          <Star fill="white" />
          <h1>SEA</h1>
        </Link>

        <SideBar />
      </nav>
    </header>
  );
};

export default NavBar;
