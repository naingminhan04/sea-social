import { getPostAction } from "@/app/_actions/postAction";
import { notFound } from "next/navigation";
import { CommentPage, CommentForm } from "@/app/_components/Comment";
import PostViewClient from "@/app/_components/PostView";

export default async function PostView({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const result = await getPostAction(postId);
  if (!result.success || !result.data) notFound();

  return (
    <div className="relative">
      <div className="flex flex-col w-full gap-2 lg:h-dvh h-[calc(100dvh-68px)] overflow-scroll scrollbar-none">
        <PostViewClient initialPost={result.data} />
        <CommentPage postId={postId} />
        <CommentForm id={postId} />
      </div>
    </div>
  );
}
