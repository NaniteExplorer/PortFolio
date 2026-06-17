import { NextResponse } from "next/server";
import { getAdminHealth } from "@/lib/admin-settings";
import { requireOwner } from "@/lib/owner-api";

export async function GET() {
  const owner = requireOwner();
  if (owner.response) return owner.response;

  const health = await getAdminHealth();
  return NextResponse.json({ ok: true, health });
}
