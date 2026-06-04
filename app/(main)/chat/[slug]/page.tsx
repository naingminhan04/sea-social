import { getUserByUsernameAction } from "@/app/_actions/user";
import { redirect } from "next/navigation";

type ChatSlugPageProps = {
  params: Promise<{ slug: string }>;
};

const ChatSlugPage = async ({ params }: ChatSlugPageProps) => {
  const { slug } = await params;
  const userResult = await getUserByUsernameAction(slug);

  if (userResult.success) {
    redirect(`/chat?chatId=${encodeURIComponent(userResult.data.id)}`);
  }

  redirect("/chat");
};

export default ChatSlugPage;
