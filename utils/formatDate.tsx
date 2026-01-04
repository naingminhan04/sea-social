import {
  differenceInDays,
  format,
  formatDistanceToNowStrict,
} from "date-fns";

import { enUS } from "date-fns/locale";

const shortEn = {
  ...enUS,
  formatDistance: (token: string, count: number) => {
    const map: Record<string, string> = {
      xSeconds: `${count}s`,
      xMinutes: `${count}m`,
      xHours: `${count}h`,
      xDays: `${count}d`,
    };

    return map[token] ?? `${count}`;
  },
};

export function formatDate(
  date: string,
  addSuffix: boolean = true,
  short: boolean = false
) {
  const createdAt = new Date(date);
  const daysAgo = differenceInDays(new Date(), createdAt);

  if (daysAgo >= 7) {
    return format(createdAt, "MMM d, yyyy");
  }

  return formatDistanceToNowStrict(createdAt, {
    addSuffix,
    locale: short ? shortEn : undefined,
  });
}

