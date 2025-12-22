"use client";

import { PostType } from "@/types/post";
import Image from "next/image";
import { useState } from "react";

const ViewReaction = ({ post }: { post: PostType }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center -space-x-2"
      >
        {[
          { key: "like", src: "/like.png" },
          { key: "love", src: "/love.png" },
          { key: "wow", src: "/wow.png" },
          { key: "haha", src: "/haha.png" },
          { key: "angry", src: "/angry.png" },
          { key: "sad", src: "/sad.png" },
        ].map((r, i) => {
          const count = (
            post.stats.reactions as unknown as Record<string, number>
          )[r.key];
          if (!count || count < 1) return null;

          return (
            <span key={r.key} style={{ zIndex: 10 + i }}>
              <Image
                src={r.src}
                alt={r.key}
                width={18}
                height={18}
                className="block"
              />
            </span>
          );
        })}
      </button>

      {open && (
        <>
        <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
            />
        <div className="absolute z-50 text-white flex flex-col bg-black w-full h-100 bottom-0 right-0">
          <div className="relative p-3 w-full">
            <h1 className="font-bold text-lg">Reactions</h1>
            <p className="text-gray-500 text-xs">See who reacted to this post</p>
            <button onClick={()=>setOpen(false)} className="absolute right-1 top-0 p-3">Close</button>
          </div>
          <button>All</button>
          <div className="overflow-scroll scrollbar-none">Naing Min Han</div>
        </div></>
      )}
    </>
  );
};

export default ViewReaction;
