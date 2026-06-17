import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  PROFILE_SYNC_SECRET_ENV,
  isProfileSyncTarget,
  profileSyncConfig,
} from "@/data/profile-sync";
import { recordSyncRun } from "@/lib/admin-settings";
import { getOwnerSession } from "@/lib/owner-auth";

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  const match = header?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

export async function POST(req: Request) {
  const expectedToken = process.env[PROFILE_SYNC_SECRET_ENV];
  const providedToken = bearerToken(req);
  const hasOwnerSession = !!getOwnerSession();
  const hasValidBearerToken = !!expectedToken && providedToken === expectedToken;

  if (!hasOwnerSession && !hasValidBearerToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized sync refresh request." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const target = body && typeof body === "object" ? (body as { target?: unknown }).target : undefined;
  if (!isProfileSyncTarget(target)) {
    return NextResponse.json(
      { ok: false, error: "Invalid sync target." },
      { status: 400 }
    );
  }

  const syncTarget = profileSyncConfig.targets[target];

  try {
    for (const tag of syncTarget.tags) revalidateTag(tag);
    for (const path of syncTarget.paths) revalidatePath(path);
    await recordSyncRun(target);

    return NextResponse.json({
      ok: true,
      target,
      tags: syncTarget.tags,
      paths: syncTarget.paths,
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to refresh profile sync cache." },
      { status: 500 }
    );
  }
}
