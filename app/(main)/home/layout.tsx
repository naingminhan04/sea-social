import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Star Education Academy",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative">
        {children}
    </main>
  );
}