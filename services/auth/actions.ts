"use server";

/**
 * Lifenergy Platform MVP 1.0
 * Server actions for authentication
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=Informe e-mail e senha.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=E-mail ou senha inválidos.");
  }

  redirect("/painel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
