/**
 * Lifenergy Platform MVP 1.0
 * Supabase Auth callback route
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const next = requestUrl.searchParams.get("next");
  const redirectTo = next?.startsWith("/") ? next : "/painel";

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
