import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function properCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function truncateText(str: string) {
  if (str.length > 100) {
    return str.substring(0, 97) + "...";
  }
  return str;
}

export function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateAsDate(date: string | Date) {
  const d = new Date(date);
  d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const newD = new Date(d);
  return newD;
}

export function formatTime(time: string | Date) {
  if (!time) return "";

  let date: Date;

  if (typeof time === "string") {
    // Expected format: "HH:mm" or "HH:mm:ss"
    const [hour, minute, second = "00"] = time.split(":");
    date = new Date();
    date.setHours(parseInt(hour), parseInt(minute), parseInt(second));
  } else {
    date = time;
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMilitaryTime(time: string | Date) {
  if (!time) return "";

  let date: Date;

  if (typeof time === "string") {
    const [hour, minute, second = "00"] = time.split(":");
    date = new Date();
    date.setHours(parseInt(hour), parseInt(minute), parseInt(second));
  } else {
    date = time;
  }

  // Format as "HH:mm"
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function getDefaultTimesRoundedToHour() {
  const now = new Date();

  // Round down to the start of the current hour
  now.setMinutes(0, 0, 0);
  const starttime = now.toTimeString().substring(0, 8); // "HH:00:00"

  // Add 3 hours to current hour
  const endDate = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const endtime = endDate.toTimeString().substring(0, 8); // "HH:00:00"

  return { starttime, endtime };
}
