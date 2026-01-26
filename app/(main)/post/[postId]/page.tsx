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
    <div>
      <div className="flex relative flex-col lg:min-h-dvh min-h-[calc(100dvh-64px)] w-full gap-2 p-2 pb-0">
          <BackButton />
        <PostViewClient initialPost={result.data} />
          <CommentPage postId={postId} />
        <div className="sticky mt-auto bottom-0">
          <CommentForm id={postId} />
        </div>
      </div>
    </div>
  );
}
