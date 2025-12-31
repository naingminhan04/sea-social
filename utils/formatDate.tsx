import {
  differenceInDays,
  format,
  formatDistanceToNowStrict,
} from "date-fns";

export function formatDate(date: string) {
  const createdAt = new Date(date);

  const daysAgo = differenceInDays(new Date(), createdAt);

  if (daysAgo >= 7) {
    return format(createdAt, "MMM d, yyyy");
  }

  return formatDistanceToNowStrict(createdAt, {
    addSuffix: true,
  });
}
