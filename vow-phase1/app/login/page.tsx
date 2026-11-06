"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const sb = supabaseBrowser(); const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    const { data, error } = mode === "in"
      ? await sb.auth.signInWithPassword({ email, password })
      : await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (mode === "up" && !data.session) return setMsg("Check your email to confirm your account, then sign in.");
    router.replace("/dashboard"); router.refresh();
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-4xl">Vow</h1>
      <p className="mb-8 mt-2 text-mute">One shared place to plan your wedding together.</p>
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm">Email<input className="field mt-1" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="block text-sm">Password<input className="field mt-1" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></label>
        {msg && <p role="alert" className="text-sm text-warn">{msg}</p>}
        <button className="btn w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</button>
      </form>
      <button className="mt-4 text-sm text-sage underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}</button>
    </main>);
}
