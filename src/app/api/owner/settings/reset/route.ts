import { NextResponse } from "next/server";
import { resetAdminSettings } from "@/lib/admin-settings";
import { requireOwner } from "@/lib/owner-api";

export async function POST() {
  const owner = requireOwner();
  if (owner.response) return owner.response;

  try {
    const reset = await resetAdminSettings();
    return NextResponse.json({ ok: true, ...reset });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unable to reset admin settings.",
      },
      { status: 500 }
    );
  }
}
