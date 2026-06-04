import type { ReactNode } from "react";

type ChatComposerShellProps = {
  children: ReactNode;
};

const ChatComposerShell = ({ children }: ChatComposerShellProps) => {
  return (
    <div className="sticky bottom-0 z-20 border-t border-black/5 bg-white/95 p-3 backdrop-blur dark:border-white/10 dark:bg-neutral-950/95">
      {children}
    </div>
  );
};

export default ChatComposerShell;
