import { Metadata } from "next";
import NavBar from "../_components/NavBar";
import ChatBar from "../_components/ChatBar";

export const metadata : Metadata = {
  title: "Home - Star Education Academy",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex md:h-dvh md:gap-2 relative justify-center">
        <NavBar/>
      <div className="md:w-4/5 lg:2/6">
        {children}
      </div>
      <div className="hidden lg:flex flex-col w-2/6">
        <ChatBar />
      </div>
    </div>
  );
}