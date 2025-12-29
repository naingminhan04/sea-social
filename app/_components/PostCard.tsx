import { PostType } from "@/types/post";
import Image from "next/image";
import PostContent from "./PostContent";
import PostMenu from "./PostMenu";
import ReactionBtn from "./ReactionBtn";
import { Share2, MessageCircle } from "lucide-react";
import ViewReaction from "./ViewReaction";
import { useAuthStore } from "@/store/auth";

const PostCard = ({ post }: { post: PostType }) => {
  const auth = useAuthStore();
  const userId = auth.user?.id
  const images = post.images || [];
  const moreCount = images.length > 4 ? images.length - 4 : 0;
  const displayImages = images.slice(0, 4);

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
          <div className="flex gap-1"><p className="font-semibold text-white">{post.author.name}</p>{post.author.id===userId && (<p className="text-blue-500 font-semibold">(You)</p>)}</div>
          <p className="text-sm text-gray-400">@{post.author.username}</p>
        </div>
        <PostMenu post={post} />
      </div>

      {/* CONTENT */}
      <div className="whitespace-pre-line text-sm leading-relaxed text-gray-200">
        <PostContent post={post} />
      </div>

      {/* IMAGES — UNCHANGED */}
      {images.length > 0 && (
        <div className={`grid gap-1 ${getGridClass(images.length)} max-h-dvh`}>
          {displayImages.map((img, index) => (
            <div key={img.id} className="relative max-h-90">
              <Image
                src={img.url}
                width={800}
                height={800}
                alt="post image"
                className="w-full h-full object-cover rounded-md"
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

      {/* FACEBOOK STYLE INTERACTIONS */}
      <div className="flex items-center justify-between border-t border-neutral-800 pt-2 text-sm text-gray-400">
        {/* LEFT ACTIONS */}
        <div className="flex items-center gap-6">
          {/* REACT */}
            <ReactionBtn post={post} />

          {/* COMMENT */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <MessageCircle size={18} />
            {post.stats.comments > 0 && (
              <span>{formatCount(post.stats.comments)}</span>
            )}
          </div>

          {/* SHARE */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <Share2 size={18} />
            {post.stats.sharedCount > 0 && (
              <span>{formatCount(post.stats.sharedCount)}</span>
            )}
          </div>
        </div>

        {/* RIGHT REACTION ICONS (NO COUNTS) */}
        <ViewReaction post={post}/>
      </div>
    </main>
  );
};

function getGridClass(length: number) {
  switch (length) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
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
