import { useEffect, useState } from "react";
import { GARAGE_TIME_ZONE, openingHours } from "@/features/business/data";

export interface OpenStatus {
  open: boolean;
  /** Index into openingHours (Monday = 0) for "today" in Cyprus. */
  todayIndex: number;
  label: string;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatTime(minutes: number) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Works out whether the garage is open right now, in the garage's own time zone. */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: GARAGE_TIME_ZONE,
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const todayIndex = Math.max(0, WEEKDAYS.indexOf(get("weekday")));
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));

  const today = openingHours[todayIndex];
  if (today && !today.closed && today.opens !== undefined && today.closes !== undefined) {
    if (minutes >= today.opens && minutes < today.closes) {
      return { open: true, todayIndex, label: `Open now until ${formatTime(today.closes)}` };
    }
    if (minutes < today.opens) {
      return {
        open: false,
        todayIndex,
        label: `Closed, opens today at ${formatTime(today.opens)}`,
      };
    }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const next = openingHours[(todayIndex + offset) % 7];
    if (next && !next.closed && next.opens !== undefined) {
      const when = offset === 1 ? "tomorrow" : next.day;
      return {
        open: false,
        todayIndex,
        label: `Closed, opens ${when} at ${formatTime(next.opens)}`,
      };
    }
  }
  return { open: false, todayIndex, label: "Closed" };
}

/**
 * Client-side only: returns null during server rendering and the first paint so
 * markup matches, then the live status, refreshed every minute.
 */
export function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return status;
}
