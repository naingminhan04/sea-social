"use client";

import { PostType } from "@/types/post";
import { useState } from "react";

const CONTENT_LIMIT = 200;

const PostContent = ({ post,view }: { post: PostType, view:boolean }) => {
  const [seeMore, setSeeMore] = useState(false);
  const content = post.content;
  const isLongContent = content.length > CONTENT_LIMIT;
  const showContent = seeMore && isLongContent;

  const toggleSeeMore = () => {
    setSeeMore((prev) => !prev);
  };

  return (
    <div
      onClick={(e)=>{if(isLongContent) {toggleSeeMore(); e.stopPropagation()}}}
      className={!view && isLongContent ? "cursor-pointer" : ""}
    >
      {view
        ? content
        : showContent
        ? content
        : content.slice(0, CONTENT_LIMIT)}

      {isLongContent && !view && (
        <button
          className="text-blue-300 hover:text-blue-500 active:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            toggleSeeMore();
          }}
        >
          {seeMore ? <span className="px-2">See less</span> : "...See more"}
        </button>
      )}
    </div>
  );
};

export default PostContent;
