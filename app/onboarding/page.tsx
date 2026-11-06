"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Onboarding() {
  const sb = supabaseBrowser(); const router = useRouter();
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    const { error } = await sb.rpc("create_wedding", { p_name: f.get("name"), p_date: f.get("date") || null,
      p_location: f.get("location") || null, p_budget: Number(f.get("budget") || 0) });
    setBusy(false); if (error) return setErr(error.message);
    router.replace("/dashboard"); router.refresh();
  }
  async function join(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await sb.rpc("join_wedding", { p_code: new FormData(e.currentTarget).get("code") });
    setBusy(false); if (error) return setErr(error.message);
    router.replace("/dashboard"); router.refresh();
  }
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-display text-3xl">Set up your wedding</h1>
      <form onSubmit={create} className="mt-6 space-y-3">
        <label className="block text-sm">Wedding name<input name="name" required className="field mt-1" placeholder="Ana & Sam" /></label>
        <label className="block text-sm">Date<input name="date" type="date" className="field mt-1" /></label>
        <label className="block text-sm">Location<input name="location" className="field mt-1" placeholder="City or venue" /></label>
        <label className="block text-sm">Total budget<input name="budget" type="number" min="0" step="0.01" className="field mt-1" /></label>
        <button className="btn w-full" disabled={busy}>Create wedding</button>
      </form>
      <hr className="my-8 border-line" />
      <h2 className="font-display text-xl">Joining your partner?</h2>
      <form onSubmit={join} className="mt-3 flex gap-2">
        <input name="code" required className="field" placeholder="Invite code" />
        <button className="btn-quiet" disabled={busy}>Join</button>
      </form>
      {err && <p role="alert" className="mt-4 text-sm text-warn">{err}</p>}
    </main>);
}
