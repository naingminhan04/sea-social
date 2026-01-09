import { Metadata } from "next";
import NavBar from "../_components/NavBar";
import ChatBar from "../_components/ChatBar";

export const metadata: Metadata = {
  title: "Home - Star Education Academy",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl gap-2 lg:flex mx-auto shadow relative justify-center">
      <NavBar />
      
      <div className="md:flex md:gap-2 relative">
        <div className="md:w-3/5">{children}</div>
        <ChatBar />
      </div>
    </div>
  );
}
