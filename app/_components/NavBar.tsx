import { Star } from "lucide-react";
import MenuBtn from "./MenuBtn";
import SideBar from "./SideBar";

const NavBar = () => {
  return (
    <header className="bg-black sticky top-0 left-0 right-0 z-10 md:w-1/5">
      <nav className="flex md:flex-col justify-between items-center p-4 md:p-0">
        <div className="flex gap-1 md:p-5">
          <Star fill="white" />
          <h1>SEA</h1>
        </div>
        <MenuBtn/>
        <SideBar/>
      </nav>
    </header>
  );
};

export default NavBar;
