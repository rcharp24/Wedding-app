import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list: any[]) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await sb.auth.getUser();
  const path = req.nextUrl.pathname;
  const open =
  path === "/" ||
  //path.startsWith("/login") ||
  //path.startsWith("/auth") ||
  path.startsWith("/dashboard");

if (!user && !open) {
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
  const publicPreview =
  path === "/" ||
  path === "/dashboard" ||
  path.startsWith("/dashboard/");

if (!user && !open && !publicPreview)
  return NextResponse.redirect(new URL("/dashboard", req.url));
  if (user && path.startsWith("/dashboard")) return NextResponse.redirect(new URL("/dashboard", req.url));
  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
