"use client";

import { Loader2, Send } from "lucide-react";

type TransferTabProps = {
  recipient: string;
  transferAmount: string;
  currentPoints: number;
  isTransferring: boolean;
  onRecipientChange: (value: string) => void;
  onTransferAmountChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const TransferTab = ({
  recipient,
  transferAmount,
  currentPoints,
  isTransferring,
  onRecipientChange,
  onTransferAmountChange,
  onSubmit,
}: TransferTabProps) => {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-black/10 bg-slate-50 p-5 dark:border-white/10 dark:bg-neutral-950">
      <div className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
        <Send size={18} />
        Transfer Points
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Send points to another user without affecting your daily claim or
        transaction lookup state.
      </p>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          Available balance
        </p>
        <p className="mt-2 text-2xl font-semibold text-black dark:text-white">
          {currentPoints}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <label className="block text-sm text-gray-700 dark:text-gray-300">
          Recipient username
          <input
            value={recipient}
            onChange={(event) => onRecipientChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm text-black outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            placeholder="Recipient username"
          />
        </label>

        <label className="block text-sm text-gray-700 dark:text-gray-300">
          Points amount
          <input
            value={transferAmount}
            onChange={(event) => onTransferAmountChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm text-black outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            placeholder="0"
            inputMode="numeric"
          />
        </label>

        <button
          type="submit"
          disabled={isTransferring}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isTransferring ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Transferring...
            </>
          ) : (
            <>
              <Send size={16} />
              Transfer
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferTab;
