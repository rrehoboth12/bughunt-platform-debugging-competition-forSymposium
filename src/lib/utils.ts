import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "—";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function rankLabel(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

export function friendlyRpcError(err: unknown, fallback: string): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  if (/content-type|invariant failed/i.test(raw)) {
    return "The save did not complete. Try again. If it keeps failing, shorten the code or split a long error list.";
  }
  if (/failed to fetch|networkerror|load failed|fetch/i.test(raw)) {
    return "Network error. Check the connection and try again.";
  }
  if (/Coordinator access required/i.test(raw)) {
    return "Coordinator session expired. Open Coordinator access and enter the code again.";
  }
  if (/Participant session required/i.test(raw)) {
    return "Your exam session expired. Register again with your participation code.";
  }
  if (raw && raw.length > 0 && raw.length < 280 && !raw.includes("    at ")) return raw;
  return fallback;
}

