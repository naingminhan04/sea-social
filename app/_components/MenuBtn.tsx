'use client'

import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";

interface Props {
    children : ReactNode;
}

const MenuBtn = ({children}:Props) => {
  const [menu, setMenu] = useState(false);
  return (
    <>
    <button onClick={() => setMenu(!menu)} className="border rounded-md px-1 cursor-pointer">
      <Menu />
    </button>
    {menu && children}
    </>
  );
};

export default MenuBtn;
