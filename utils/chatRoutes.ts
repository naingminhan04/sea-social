import type { Chat, DraftPrivateChat, SelectedChat } from "@/types/chat";
import type { SearchUserType } from "@/types/search";
import type { UserType } from "@/types/user";

const isDraftChatSelection = (chat: Chat | SelectedChat): chat is DraftPrivateChat =>
  "type" in chat && chat.type === "PRIVATE_DRAFT";

export const getChatIdParam = (chat: Chat | SelectedChat) => {
  if (isDraftChatSelection(chat)) {
    return chat.user.id;
  }
  return chat.id;
};

export const buildChatPath = (
  chat: Chat | SelectedChat,
  query?: { replyMsgId?: string | null },
) => {
  const params = new URLSearchParams();
  params.set("chatId", getChatIdParam(chat));

  const replyMsgId = query?.replyMsgId;
  if (replyMsgId) {
    params.set("replyMsgId", replyMsgId);
  }

  return `/chat?${params.toString()}`;
};

export const findChatById = (chats: Chat[], chatId: string | null | undefined) => {
  const id = chatId?.trim();
  if (!id) return undefined;
  return chats.find((chat) => chat.id === id);
};

export const chatMatchesId = (chat: SelectedChat, chatId: string | null | undefined) => {
  const id = chatId?.trim();
  if (!id) return false;
  if (isDraftChatSelection(chat)) {
    return chat.user.id === id;
  }
  return chat.id === id;
};

export const syncChatUrl = (chatId: string | null, replyMsgId?: string | null) => {
  if (typeof window === "undefined") return;

  if (!chatId) {
    window.history.replaceState(null, "", "/chat");
    return;
  }

  const params = new URLSearchParams({ chatId });
  if (replyMsgId) {
    params.set("replyMsgId", replyMsgId);
  }
  window.history.replaceState(null, "", `/chat?${params.toString()}`);
};

export const userToDraftChatUser = (user: UserType): SearchUserType => ({
  id: user.id,
  name: user.name ?? user.username,
  username: user.username,
  profilePic: user.profilePic ?? null,
});
