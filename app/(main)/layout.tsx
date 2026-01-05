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
      <div className="md:flex w-full md:h-[calc(100dvh-68px)] lg:h-dvh md:gap-2">
        <div className="md:w-3/5">{children}</div>
        <div className="hidden md:flex flex-col md:w-2/5">
          <ChatBar />
        </div>
      </div>
    </div>
  );
}
