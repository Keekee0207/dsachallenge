import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user?.email) {
      const email = data.user.email.toLowerCase();

      // Check allowlist in Supabase
      const { data: allowed } = await supabase
        .from("allowed_emails")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (!allowed) {
        // Not on allowlist! Sign out and redirect with error
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/?access_denied=${encodeURIComponent(email)}`);
      }

      // Allowed! Ensure participant profile exists
      await supabase.from("participants").upsert(
        {
          auth_user_id: data.user.id,
          email: allowed.email,
          name: allowed.name || data.user.user_metadata?.full_name || email.split("@")[0],
          role: allowed.role,
          avatar_url: data.user.user_metadata?.avatar_url,
        },
        { onConflict: "email" }
      );

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page or home with some instructions
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
