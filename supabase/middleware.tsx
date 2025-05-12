// import { validateSessionAction } from "@/actions/sessionAction";
// import { checkSession } from "@/actions/authAction";
import { validateUserSession } from "@/actions/authAction";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Route type definitions
type PublicRoute = "/login" | "/register";
type RestrictedRoute = "/dashboard" | "/team" | "/comments" | "/departments";
type ProtectedAuthRoute = "/login" | "/register" | "/";

// Route configurations
const ROUTES = {
  PUBLIC: ["/login", "/register"] as PublicRoute[],
  RESTRICTED: [
    "/dashboard",
    "/team",
    "/comments",
    "/departments",
  ] as RestrictedRoute[],
  PROTECTED_AUTH: ["/login", "/register", "/"] as ProtectedAuthRoute[],
} as const;

// Role definitions
const ROLES = {
  SUPERADMIN: "Superadmin",
  ADMIN: "Admin",
  USER: "User",
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Updates the session and handles route protection based on user authentication and roles
 * @param request The incoming Next.js request
 * @returns NextResponse with appropriate redirects or next() response
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Initialize Supabase client
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
        },
      },
    }
  );

  const user = await validateUserSession();
  const currentPath = request.nextUrl.pathname as
    | PublicRoute
    | RestrictedRoute
    | ProtectedAuthRoute;
  const userRole = user?.user?.role?.name as Role | undefined;

  // Set user role in headers if available
  if (userRole) {
    supabaseResponse.headers.set("X-User-Role", userRole);
  }

  // Handle unauthorized access to protected routes
  if (!user.authorized && !ROUTES.PUBLIC.includes(currentPath as PublicRoute)) {
    return redirectTo("/login", request);
  }

  // Handle authenticated user access to auth routes
  if (
    user.authorized &&
    ROUTES.PROTECTED_AUTH.includes(currentPath as ProtectedAuthRoute)
  ) {
    if (userRole === ROLES.SUPERADMIN || userRole === ROLES.ADMIN) {
      return redirectTo("/dashboard", request);
    }
  }

  // Handle restricted routes access
  if (
    user.authorized &&
    ROUTES.RESTRICTED.includes(currentPath as RestrictedRoute)
  ) {
    if (userRole === ROLES.USER) {
      return redirectTo("/", request);
    }
  }

  return supabaseResponse;
}

/**
 * Helper function to create a redirect response
 * @param path The path to redirect to
 * @param request The original request
 * @returns NextResponse with redirect
 */
function redirectTo(path: string, request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}
