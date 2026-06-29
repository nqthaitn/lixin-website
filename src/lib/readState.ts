// Per-device "已读 / đã đọc" tracking for anonymous (logged-out) visitors.
//
// There is no public account, so read state can't live in the DB keyed by user.
// We store the set of read article ids in localStorage instead — it's a personal
// UX marker (dim/badge already-read cards), not analytics. Best-effort: it's lost
// when the visitor clears storage or switches device, which is acceptable here.

const READ_KEY = "lixin:news:read";
const MAX = 500; // cap storage; drop the oldest ids beyond this

function readArray(): number[] {
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as number[]) : [];
  } catch {
    return [];
  }
}

export function getReadIds(): Set<number> {
  if (typeof window === "undefined") return new Set();
  return new Set(readArray());
}

export function markRead(id: number): void {
  if (typeof window === "undefined") return;
  try {
    // Move id to the most-recent position, then keep only the last MAX ids.
    const next = readArray().filter((x) => x !== id);
    next.push(id);
    window.localStorage.setItem(READ_KEY, JSON.stringify(next.slice(-MAX)));
  } catch {
    /* localStorage unavailable (private mode / quota) — marks are best-effort */
  }
}
