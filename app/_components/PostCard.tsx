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
import Link from "next/link";
import toast from "react-hot-toast";

const PostCard = ({ post, view }: { post: PostType; view: boolean }) => {
  const auth = useAuthStore();
  const userId = auth.user?.id;
  const images = post.images || [];
  const moreCount = images.length > 4 ? images.length - 4 : 0;
  const displayImages = images.slice(0, 4);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isDel, setIsDel] = useState(false);
  const [imageState, setImageState] = useState<
    Record<number, "loading" | "loaded" | "broken">
  >(() => images.reduce((acc, _, i) => ({ ...acc, [i]: "loading" }), {}));

  const timestamp = post.createdAt;
  const relativeTime = formatDate(timestamp);

  return (
    <div
      className={`group bg-neutral-900 relative rounded-xl transition-all 
      ${!view && "hover:bg-neutral-800"} 
      ${isDel && "opacity-50 pointer-events-none"}`}
    >
      {!view && (
        <Link
          href={`post/${post.id}`}
          prefetch={true}
          className="absolute inset-0 rounded-xl"
          aria-label="View post"
        />
      )}

      <div className="relative pointer-events-none">
        <div className="p-3 pb-0 space-y-4">
          <div className="flex items-center gap-3 w-full">
            <div className="pointer-events-auto flex items-center gap-3">
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
            </div>

            <div className="ml-auto pointer-events-auto">
              <PostMenu post={post} onDeletingChange={setIsDel} view={view} />
            </div>
          </div>

          <div className="whitespace-pre-line text-sm w-fit leading-relaxed text-gray-200 pointer-events-auto">
            <PostContent post={post} view={view} />
          </div>

          {images.length > 0 && (
            <div
              className={`grid gap-1 pointer-events-auto ${getGridClass(
                images.length
              )} min-h-90 sm:min-h-150 md:min-h-90 rounded-2xl overflow-hidden`}
            >
              {displayImages.map((img, index) => (
                <div
                  key={img.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setViewerIndex(index);
                    setViewerOpen(true);
                  }}
                  className={`relative cursor-pointer min-h-45 max-h-90 sm:min-h-45 sm:max-h-150 md:min-h-45 md:max-h-90 ${
                    images.length === 3 && index === 2 ? "col-span-2" : ""
                  }`}
                >
                  <Image
                    src={imageState[index] === "broken" ? "/alt.png" : img.url}
                    fill
                    alt="Post Image"
                    className={`object-cover transition-opacity duration-300 ${
                      imageState[index] === "broken" && "bg-neutral-500"
                    } ${
                      imageState[index] === "loading"
                        ? " bg-neutral-400 animate-pulse"
                        : "opacity-100"
                    }`}
                    onLoad={() =>
                      setImageState((prev) => ({
                        ...prev,
                        [index]: "loaded",
                      }))
                    }
                    onError={() =>
                      setImageState((prev) => ({
                        ...prev,
                        [index]: "broken",
                      }))
                    }
                  />

                  {index === 3 && moreCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                      +{moreCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm p-1 text-gray-400">
          <div className="flex items-center pointer-events-auto">
            <ReactionBtn post={post} />
            <CommentBtn post={post} view={view} />

            <div onClick={()=>{navigator.clipboard.writeText(`https://stareducationacademy.netlify.app/post/${post.id}`); toast.success("Link copied to clipboard",{id: `share-${post.id}`,duration: 1000});}} className="flex items-center gap-1 cursor-pointer px-2 h-10 hover:bg-neutral-500 rounded-xl justify-center active:scale-95 hover:text-white">
              <Share2 size={18} />
              {post.stats.sharedCount > 0 && (
                <span>{formatCount(post.stats.sharedCount)}</span>
              )}
            </div>
          </div>

          <div className="pointer-events-auto">
            <ViewReaction post={post} />
          </div>
        </div>
      </div>

      {viewerOpen && (
        <div className="relative z-100">
          <ImageViewer
            images={images}
            index={viewerIndex}
            onClose={() => setViewerOpen(false)}
            onChange={setViewerIndex}
          />
        </div>
      )}
    </div>
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