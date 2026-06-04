"use client";

import { useChatNavigation } from "@/app/_components/chat/ChatNavigation";
import type { ReactNode } from "react";

type ChatWorkspaceLayoutProps = {
  list: ReactNode;
  panel: ReactNode;
};

const ChatWorkspaceLayout = ({ list, panel }: ChatWorkspaceLayoutProps) => {
  const { showPanel } = useChatNavigation();

  return (
    <div className="flex h-full min-h-0 w-full">
      <div
        className={`h-full min-h-0 w-full flex-col ${
          showPanel ? "hidden" : "flex"
        }`}
      >
        {list}
      </div>
      <section
        className={`h-full min-h-0 w-full flex-col overflow-hidden ${
          showPanel ? "flex" : "hidden"
        }`}
      >
        {panel}
      </section>
    </div>
  );
};

export default ChatWorkspaceLayout;
