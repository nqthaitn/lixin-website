"use client";

import { useEffect } from "react";
import { markRead } from "@/lib/readState";

// Mounted on a news detail page. Records that the current (anonymous) visitor
// opened this article:
//   1. marks it "read" in localStorage so the news list can dim/badge it, and
//   2. bumps the server-side read counter once per browser session (deduped via
//      sessionStorage so a refresh doesn't inflate the number).
// Renders nothing.
export default function ReadTracker({ id }: { id: number }) {
  useEffect(() => {
    markRead(id);

    const sessionKey = `lixin:viewed:${id}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return; // already counted this session
      sessionStorage.setItem(sessionKey, "1");
    } catch {
      // No sessionStorage (private mode) → still count, just without dedupe.
    }

    // Fire-and-forget; a failed count must never affect the reading experience.
    fetch(`/api/news/${id}/view`, { method: "POST", keepalive: true }).catch(() => {});
  }, [id]);

  return null;
}
