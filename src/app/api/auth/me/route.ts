import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  const ok = await isAdmin();
  return NextResponse.json({ admin: ok });
}
