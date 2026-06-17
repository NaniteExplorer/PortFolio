import { NextResponse } from "next/server";
import { getAdminSettings, saveAdminSettings } from "@/lib/admin-settings";
import { requireOwner } from "@/lib/owner-api";

export async function GET() {
  const owner = requireOwner();
  if (owner.response) return owner.response;

  const settings = await getAdminSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PATCH(req: Request) {
  const owner = requireOwner();
  if (owner.response) return owner.response;

  try {
    const body = await req.json();
    const settings = body?.settings;
    if (!settings || settings.version !== 1) {
      return NextResponse.json({ ok: false, error: "Invalid settings payload." }, { status: 400 });
    }

    const saved = await saveAdminSettings(settings);
    return NextResponse.json({ ok: true, ...saved });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unable to save admin settings.",
      },
      { status: 500 }
    );
  }
}
