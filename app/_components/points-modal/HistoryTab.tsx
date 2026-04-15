"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { PointsTransactionsResponse } from "@/types/points";

type HistoryTabProps = {
  page: number;
  transactions?: PointsTransactionsResponse;
  isLoading: boolean;
  isFetching: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
};

const HistoryTab = ({
  page,
  transactions,
  isLoading,
  isFetching,
  onPrevPage,
  onNextPage,
}: HistoryTabProps) => {
  return (
    <div className="rounded-3xl border border-black/10 bg-slate-50 p-5 dark:border-white/10 dark:bg-neutral-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Transaction history
          </p>
          <p className="mt-2 text-lg font-semibold text-black dark:text-white">
            Page {page}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 text-sm text-gray-700 dark:bg-neutral-900 dark:text-gray-300">
          {isFetching ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowRight size={16} />
          )}
          {transactions?.transactions.length ?? 0}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={!transactions?.hasPrev || isFetching}
          className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <button
          type="button"
          onClick={onNextPage}
          disabled={!transactions?.hasNext || isFetching}
          className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
            Loading transactions...
          </p>
        ) : (transactions?.transactions.length ?? 0) > 0 ? (
          transactions?.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-black dark:text-white">
                  {transaction.type}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    transaction.type === "EARN"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "EARN" ? "+" : "-"}
                  {transaction.amount}
                </p>
              </div>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-gray-100 p-3 text-xs text-gray-700 dark:bg-neutral-950 dark:text-gray-300">
                {JSON.stringify(transaction.reason ?? {}, null, 2)}
              </pre>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
            No transactions available yet.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={!transactions?.hasPrev || isFetching}
          className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <button
          type="button"
          onClick={onNextPage}
          disabled={!transactions?.hasNext || isFetching}
          className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default HistoryTab;
