import PostCard from "@/app/_components/PostCard";
import { getPostAction } from "@/app/_actions/postAction";
import { notFound } from "next/navigation";
import { CommentPage, CommentForm } from "@/app/_components/Comment";

export default async function PostView({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const result = await getPostAction(postId);

  if (!result.success || !result.data) {
    notFound();
  }

  return <div className="flex flex-col w-full gap-2 lg:h-dvh h-[calc(100dvh-68px)] overflow-scroll scrollbar-none"><PostCard post={result.data}  view={true}/><CommentPage postId={postId}/><CommentForm id={postId}/></div>;
}
