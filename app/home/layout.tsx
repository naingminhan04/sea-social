import { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata : Metadata = {
  title: "Home - Star Education Academy",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <NavBar />
      {children}
    </div>
  );
}