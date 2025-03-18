// import { validateSessionAction } from "@/actions/sessionAction";
// import { checkSession } from "@/actions/authAction";
import { validateUserSession } from "@/actions/authAction";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  createServerClient(
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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and supabase.auth.getUser()
  const user = await validateUserSession();
  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/api/public",
    "/login",
    "/register",
  ];

  const protectedAuthRoutes = ["/login", "/register"];

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  if (!user.authorized && !isPublicRoute) {
    // Kein Benutzer vorhanden und Route ist nicht public -> Umleitung zur Login-Seite
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const isProtectedAuthRoute = protectedAuthRoutes.includes(
    request.nextUrl.pathname
  );

  if (user.authorized && isProtectedAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user?.user?.role?.name) {
    supabaseResponse.headers.set("X-User-Role", user.user.role.name);
  }

  return supabaseResponse;
}
