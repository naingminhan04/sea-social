"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed md:absolute px-2 hover:p-0 top-1/2 + -translate-y-1/2 -right-6 rounded-l-2xl w-14 h-30 backdrop-blur-md bg-white/10 flex items-center justify-start hover:justify-center active:justify-center active:-right-1 hover:-right-3 cursor-pointer z-10 transition-all"
      aria-label="Back"
    >
      <ArrowLeft size={24} />
    </button>
  );
};

export default BackButton;
