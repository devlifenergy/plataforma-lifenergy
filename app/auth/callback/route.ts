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

  return NextResponse.redirect(new URL("/painel", requestUrl.origin));
}
