"use client";

import { useState } from "react";
import ImageViewer from "./ImageViewer";
import { PostType } from "@/types/post";
import Image from "next/image";
import PostContent from "./PostContent";
import PostMenu from "./PostMenu";
import ReactionBtn from "./ReactionBtn";
import { Share2 } from "lucide-react";
import ViewReaction from "./ViewReaction";
import { useAuthStore } from "@/store/auth";
import { formatDate } from "@/utils/formatDate";
import CommentBtn from "./Comment";

const PostCard = ({ post }: { post: PostType }) => {
  const auth = useAuthStore();
  const userId = auth.user?.id;
  const images = post.images || [];
  const moreCount = images.length > 4 ? images.length - 4 : 0;
  const displayImages = images.slice(0, 4);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const timestamp = post.createdAt;
  const relativeTime = formatDate(timestamp);

  return (
    <main className="bg-neutral-900 p-4 space-y-4 rounded-xl">
      {/* AUTHOR */}
      <div className="flex items-center gap-3 w-full">
        <Image
          src={post.author.profilePic || "/default-avatar.png"}
          alt={post.author.name}
          width={100}
          height={100}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold flex gap-1 text-white">
            {post.author.name}
            {post.author.id === userId && (
              <span className="text-blue-500 font-semibold">(You)</span>
            )}
          </p>
          <p className="text-xs flex gap-1 text-gray-400 self-center">
            {relativeTime}
            {post.isEdited && <span>[Edited]</span>}
          </p>
        </div>
        <PostMenu post={post} />
      </div>

      <div className="whitespace-pre-line text-sm leading-relaxed text-gray-200">
        <PostContent post={post} />
      </div>

      {images.length > 0 && (
        <div
          className={`grid gap-1 ${getGridClass(
            images.length
          )} min-h-90 sm:min-h-150 md:min-h-90 rounded-2xl overflow-hidden`}
        >
          {displayImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => {
                setViewerIndex(index);
                setViewerOpen(true);
              }}
              className={`relative cursor-pointer min-h-45 max-h-90 sm:min-h-45 sm:max-h-150 md:min-h-45 md:max-h-90 ${
                images.length === 3 && index === 2 ? "col-span-2" : ""
              }`}
            >
              <Image
                src={img.url}
                fill
                alt="post image"
                className="object-cover"
              />

              {index === 3 && moreCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold rounded-md">
                  +{moreCount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-neutral-800 pt-2 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          <ReactionBtn post={post} />

          <CommentBtn post={post} />

          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <Share2 size={18} />
            {post.stats.sharedCount > 0 && (
              <span>{formatCount(post.stats.sharedCount)}</span>
            )}
          </div>
        </div>

        <ViewReaction post={post} />
      </div>
      {viewerOpen && (
        <ImageViewer
          images={images}
          index={viewerIndex}
          onClose={() => setViewerOpen(false)}
          onChange={setViewerIndex}
        />
      )}
    </main>
  );
};

function getGridClass(length: number) {
  switch (length) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-rows-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
    default:
      return "grid-cols-2 grid-rows-2";
  }
}

export function formatCount(num: number) {
  if (num < 1000) return num;
  return (num / 1000).toFixed(1).replace(".0", "") + "k";
}

export default PostCard;
