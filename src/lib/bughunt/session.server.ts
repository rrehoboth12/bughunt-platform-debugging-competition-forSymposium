import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import type { SessionRole } from "./types";

const COOKIE = "bh_sid";
const PARTICIPANT_CODES = ["mirai2026A", "mirai2026B"] as const;
const COORDINATOR_CODE = "mirai2026C";
const SESSION_DAYS = 2;

function shaHex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function hashedEqual(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

export function matchParticipantTrack(code: string): "A" | "B" | null {
  const trimmed = code.trim();
  if (hashedEqual(trimmed, PARTICIPANT_CODES[0])) return "A";
  if (hashedEqual(trimmed, PARTICIPANT_CODES[1])) return "B";
  return null;
}

export function isCoordinatorCode(code: string): boolean {
  return hashedEqual(code.trim(), COORDINATOR_CODE);
}

function cookieSecure(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function createSession(
  role: SessionRole,
  participantId: string | null,
): Promise<void> {
  const sql = await getSql();
  const token = randomBytes(32).toString("hex");
  const id = randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`
    insert into sessions (id, token_hash, role, participant_id, expires_at)
    values (${id}, ${shaHex(token)}, ${role}, ${participantId}, ${expires.toISOString()})
  `;
  setCookie(COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSession(): Promise<void> {
  const token = getCookie(COOKIE);
  if (token) {
    const sql = await getSql();
    await sql`delete from sessions where token_hash = ${shaHex(token)}`;
  }
  deleteCookie(COOKIE, { path: "/" });
}

export type SessionRow = {
  id: string;
  role: SessionRole;
  participantId: string | null;
};

export async function readSession(): Promise<SessionRow | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    role: string;
    participant_id: string | null;
    expires_at: string | Date;
  }>`
    select id, role, participant_id, expires_at
    from sessions
    where token_hash = ${shaHex(token)}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  const expires =
    row.expires_at instanceof Date
      ? row.expires_at.getTime()
      : Date.parse(String(row.expires_at));
  if (!Number.isFinite(expires) || expires < Date.now()) {
    await sql`delete from sessions where id = ${row.id}`;
    return null;
  }
  return {
    id: row.id,
    role: row.role as SessionRole,
    participantId: row.participant_id,
  };
}
