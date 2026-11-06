import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
type CookieList = { name: string; value: string; options: CookieOptions }[];
export function supabaseServer() {
  const store = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => store.getAll(),
      setAll: (list: CookieList) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {} } } });
};