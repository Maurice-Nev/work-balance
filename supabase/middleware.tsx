import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 🟢 Definiere eine Liste mit öffentlichen Seiten
const publicRoutes = ["/", "/login", "/register", "/about", "/contact"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 🔥 WICHTIG: `supabase.auth.getUser()` **muss** aufgerufen werden!
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 🟢 Falls die Route öffentlich ist, erlauben wir Zugriff ohne Auth
  if (publicRoutes.includes(pathname)) {
    return supabaseResponse;
  }

  // 🔴 Falls die Route privat ist & kein User eingeloggt ist → Redirect zur Login-Seite
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 🟢 Falls der User eingeloggt ist, einfach weiterleiten
  return supabaseResponse;
}
