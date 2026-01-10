import { getPostAction } from "@/app/_actions/postAction";
import { notFound } from "next/navigation";
import { CommentPage, CommentForm } from "@/app/_components/Comment";
import PostViewClient from "@/app/_components/PostView";
import BackButton from "@/app/_components/BackButton";

export default async function PostView({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const result = await getPostAction(postId);
  if (!result.success || !result.data) notFound();

  return (
    <div className="relative overflow-x-hidden">
      <div className="flex flex-col w-full gap-2 p-2 pb-0 overscroll-none lg:h-dvh h-[calc(100dvh-68px)] overflow-scroll scrollbar-none">
        <BackButton />
        <PostViewClient initialPost={result.data} />
        <CommentPage postId={postId} />
        <CommentForm id={postId} />
      </div>
    </div>
  );
}
