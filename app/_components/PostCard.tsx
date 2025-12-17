import { PostType } from "@/types/post";
import { ThumbsUp,Share2,MessageCircle  } from "lucide-react";
import Image from "next/image";
import PostContent from "./PostContent";

const PostCard = ({ post }: { post: PostType }) => {
  const images = post.images || [];
  const moreCount = images.length > 4 ? images.length - 4 : 0;
  const displayImages = images.slice(0, 4);

  return (
    <main className=" bg-neutral-900 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Image
          src={post.author.profilePic || "/default-avatar.png"}
          alt={post.author.name}
          width={100}
          height={100}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm">@{post.author.username}</p>
        </div>
      </div>

      <div className="whitespace-pre-line text-sm leading-relaxed">
        <PostContent post={post} />
      </div>

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

      <div className="flex justify-between text-sm text-gray-500 pt-2">
        <span className="flex items-center gap-2"><ThumbsUp />{post.stats.reactions.total}</span>
        <span className="flex items-center gap-2"> <MessageCircle/> {post.stats.comments}</span>
        <span className="flex items-center gap-2"> <Share2 /> {post.stats.sharedCount}</span>
      </div>

      <div className="flex justify-between border-t pt-3 text-sm font-medium text-gray-600">
        <button className="flex-1 hover:text-blue-600">Like</button>
        <button className="flex-1 hover:text-green-600">Comment</button>
        <button className="flex-1 hover:text-purple-600">Share</button>
      </div>
    </main>
  );
};

// Helper function to return Tailwind grid classes based on number of images
function getGridClass(length: number) {
  switch (length) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2"; // left 1 large, right 2 stacked
    case 4:
      return "grid-cols-2 grid-rows-2";
    default:
      return "grid-cols-2 grid-rows-2"; // 5+ images
  }
}

export default PostCard;
