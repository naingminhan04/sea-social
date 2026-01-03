import { Star } from "lucide-react";
import MenuBtn from "./MenuBtn";
import SideBar from "./SideBar";

const NavBar = () => {
  return (
    <header className="bg-black lg:bg-neutral-900 h-15 lg:h-dvh sticky top-0 left-0 right-0 z-70 lg:w-2/9 shrink-0 mb-2 lg:mb-0">
      <nav className="flex lg:flex-col justify-between items-center p-4 lg:p-0 gap-2">
        <MenuBtn />
        <div className="flex gap-1 lg:w-full lg:bg-black lg:p-5">
          <Star fill="white" />
          <h1>SEA</h1>
        </div>

        <SideBar />
      </nav>
    </header>
  );
};

export default NavBar;
