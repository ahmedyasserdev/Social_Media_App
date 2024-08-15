import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNowStrict } from "date-fns"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatRelativeDate = (from: Date | string | null | undefined) => {
  if (!from) {
    throw new Error("Invalid date provided");
  }

  const fromDate = new Date(from);
  const currentDate = new Date();

  if (isNaN(fromDate.getTime())) {
    throw new Error("Invalid date provided");
  }

  if (currentDate.getTime() - fromDate.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(fromDate, { addSuffix: true });
  } else {
    if (fromDate.getFullYear() === currentDate.getFullYear()) {
      return formatDate(fromDate, "MMM d");
    } else {
      return formatDate(fromDate, "MMM d, yyyy");
    }
  }
};

export const formatNumber = (num : number) => {
  return new Intl.NumberFormat("en-US", {notation : "compact" , maximumFractionDigits : 1}).format(num)
}