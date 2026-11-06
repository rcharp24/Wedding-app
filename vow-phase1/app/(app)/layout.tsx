import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer();
  const { data: wedding } = await sb.from("weddings").select("name").limit(1).maybeSingle();
  if (!wedding) redirect("/onboarding");
  return <div className="md:flex"><Nav name={wedding.name} /><main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">{children}</main></div>;
}
