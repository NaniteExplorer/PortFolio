import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/owner-auth";

export function requireOwner() {
  const session = getOwnerSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 }),
    };
  }
  return { session, response: null };
}
