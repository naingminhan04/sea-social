"use client";

import { Gift, History, Info, Loader2, ShieldCheck } from "lucide-react";
import {
  PointsDailyLoginInfoResponse,
  PointsTransactionSummaryType,
} from "@/types/points";

type OverviewTabProps = {
  currentPoints: number;
  dailyInfo?: PointsDailyLoginInfoResponse;
  summary?: PointsTransactionSummaryType;
  formattedLastClaim: string;
  isClaiming: boolean;
  isInfoLoading: boolean;
  isSummaryLoading: boolean;
  onClaimDaily: () => void;
  onOpenHistory: () => void;
};

const OverviewTab = ({
  currentPoints,
  dailyInfo,
  summary,
  formattedLastClaim,
  isClaiming,
  isInfoLoading,
  isSummaryLoading,
  onClaimDaily,
  onOpenHistory,
}: OverviewTabProps) => {
  const isDailyDisabled = isClaiming || isInfoLoading || !dailyInfo?.canClaim;

  return (
    <div className="grid w-full max-w-full gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-3xl border border-black/10 bg-slate-50 p-5 dark:border-white/10 dark:bg-neutral-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Your balance
            </p>
            <p className="mt-2 text-4xl font-semibold text-black dark:text-white">
              {currentPoints}
            </p>
          </div>
          <button
            type="button"
            onClick={onClaimDaily}
            disabled={isDailyDisabled}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isClaiming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : dailyInfo?.canClaim ? (
              "Claim Daily"
            ) : (
              "Already Claimed"
            )}
            <Gift size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Streak", value: dailyInfo?.streak ?? "-" },
            {
              label: "Remaining Balance",
              value: dailyInfo?.remainingBalance ?? "-",
            },
            { label: "Points Earned", value: dailyInfo?.pointsEarned ?? "-" },
            {
              label: "Available Today",
              value: dailyInfo?.pointsAvailable ?? "-",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
            >
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-black dark:text-white">
                {isInfoLoading ? "Loading..." : item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <Info size={16} />
            Last claim
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isInfoLoading ? "Loading..." : formattedLastClaim}
          </p>
        </div>
      </div>

      <div className="min-w-0 rounded-3xl border border-black/10 bg-slate-50 p-5 dark:border-white/10 dark:bg-neutral-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Transaction summary
            </p>
            <p className="mt-2 text-lg font-semibold text-black dark:text-white">
              {isSummaryLoading ? "Loading..." : "Latest totals"}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 text-sm text-gray-700 dark:bg-neutral-900 dark:text-gray-300">
            <ShieldCheck size={16} />
            secure
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {[
            {
              label: "Earned",
              value: summary?.totalEarned ?? "-",
              accent: "text-green-600",
            },
            {
              label: "Spent",
              value: summary?.totalSpent ?? "-",
              accent: "text-red-600",
            },
            {
              label: "Balance",
              value: summary?.currentBalance ?? "-",
              accent: "text-blue-600",
            },
            {
              label: "Transactions",
              value: summary?.transactionCount ?? "-",
              accent: "text-gray-700 dark:text-gray-100",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className={`mt-2 text-xl font-semibold ${item.accent}`}>
                {isSummaryLoading ? "Loading..." : item.value}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenHistory}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:border-blue-500/50 dark:hover:text-blue-200"
        >
          <History size={16} />
          Transaction History
        </button>
      </div>
    </div>
  );
};

export default OverviewTab;
