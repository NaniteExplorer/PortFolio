import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/owner-auth";

export async function GET() {
  const session = getOwnerSession();
  return NextResponse.json({
    ok: true,
    authenticated: !!session,
    owner: session
      ? {
          email: session.email,
          name: session.name,
          picture: session.picture,
        }
      : null,
  });
}
