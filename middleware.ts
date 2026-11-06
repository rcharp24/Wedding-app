
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // TEMPORARY PREVIEW MODE
  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: any;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await sb.auth.getUser();

  const path = request.nextUrl.pathname;

  const open =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/auth");

  if (!user && !open) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && path.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
