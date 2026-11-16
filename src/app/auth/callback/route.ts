import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { INITIAL_ALLOWLIST } from "@/data/initial-allowlist";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv ? origin : forwardedHost ? `https://${forwardedHost}` : origin;

  if (code) {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

    // Track cookies to copy them directly onto the redirect response
    const cookiesToSetOnResponse: { name: string; value: string; options: any }[] = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) => {
              cookieStore.set(name, value, options);
              cookiesToSetOnResponse.push({ name, value, options });
            });
          } catch {
            // Ignored
          }
        },
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user?.email) {
      const email = data.user.email.toLowerCase().trim();

      // Check allowlist: check Supabase DB first, then fallback to INITIAL_ALLOWLIST
      let allowed: any = null;
      try {
        const { data: dbAllowed } = await supabase
          .from("allowed_emails")
          .select("*")
          .eq("email", email)
          .eq("is_active", true)
          .single();
        allowed = dbAllowed;
      } catch (e) {
        console.error("DB check error for allowed_emails:", e);
      }

      if (!allowed) {
        allowed = INITIAL_ALLOWLIST.find(
          (a) => a.email.toLowerCase() === email && a.is_active
        );
      }

      if (!allowed) {
        // Not on cohort allowlist! Sign out and show Access Denied
        await supabase.auth.signOut();
        const res = NextResponse.redirect(`${baseUrl}/?access_denied=${encodeURIComponent(email)}`);
        return res;
      }

      // Try to upsert participant profile in DB if table exists
      try {
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
      } catch (e) {
        console.error("Could not upsert participant profile:", e);
      }

      // Direct admin to /admin and participant to /
      const targetPath = allowed.role === "admin" ? "/admin" : next;
      const response = NextResponse.redirect(`${baseUrl}${targetPath}`);

      // Ensure all session cookies are attached to the HTTP redirect response
      cookiesToSetOnResponse.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      return response;
    }
  }

  return NextResponse.redirect(`${baseUrl}/?auth_error=true`);
}
