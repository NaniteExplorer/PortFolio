import { NextResponse } from "next/server";
import { OWNER_SESSION_COOKIE } from "@/data/profile-sync";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/owner", req.url));
  res.cookies.delete(OWNER_SESSION_COOKIE);
  return res;
}
