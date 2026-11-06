import { supabaseServer } from "@/lib/supabase/server";
const money = (n: number) => Number(n).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export default async function Dashboard() {
  const sb = supabaseServer();
  const [{ data: w }, { data: tasks }, { data: exp }, { data: guests }] = await Promise.all([
    sb.from("weddings").select("*").limit(1).single(),
    sb.from("tasks").select("title,due_date,done").order("due_date", { nullsFirst: false }),
    sb.from("expenses").select("actual,estimated"),
    sb.from("guests").select("invited,rsvp_status")]);
  const days = w.wedding_date ? Math.ceil((+new Date(w.wedding_date) - Date.now()) / 864e5) : null;
  const spent = (exp ?? []).reduce((s, e) => s + Number(e.actual), 0);
  const invited = (guests ?? []).filter(g => g.invited).length;
  const yes = (guests ?? []).filter(g => g.rsvp_status === "attending").length;
  const pending = (guests ?? []).filter(g => g.invited && g.rsvp_status === "pending").length;
  const open = (tasks ?? []).filter(t => !t.done); const done = (tasks ?? []).length - open.length;
  const pct = tasks?.length ? Math.round((done / tasks.length) * 100) : 0;
  const stats: [string, string][] = [["Total budget", money(w.total_budget)], ["Spent", money(spent)], ["Remaining", money(w.total_budget - spent)],
    ["Invited", String(invited)], ["Confirmed", String(yes)], ["Awaiting RSVP", String(pending)]];
  return (
    <div className="max-w-4xl">
      <section className="border-b border-line pb-8">
        <h1 className="font-display text-4xl md:text-5xl">{w.name}</h1>
        <p className="mt-2 text-mute">{[w.wedding_date && new Date(w.wedding_date + "T00:00").toLocaleDateString(undefined, { dateStyle: "long" }), w.location].filter(Boolean).join(" in ") || "Add a date and place in Settings"}</p>
        {days !== null && <p className="mt-6 font-display text-6xl text-sage">{days >= 0 ? days : 0}<span className="ml-3 font-sans text-lg text-mute">{days === 1 ? "day to go" : days < 0 ? "days: congratulations" : "days to go"}</span></p>}
      </section>
      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {stats.map(([k, v]) => <div key={k}><dt className="text-sm text-mute">{k}</dt><dd className="font-display text-2xl">{v}</dd></div>)}
      </dl>
      <section className="mt-10">
        <div className="flex items-baseline justify-between"><h2 className="font-display text-xl">Planning checklist</h2><span className="text-sm text-mute">{done} of {tasks?.length ?? 0} done</span></div>
        <div className="mt-2 h-2 rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="h-2 rounded-full bg-sage" style={{ width: `${pct}%` }} /></div>
        <ul className="mt-4 divide-y divide-line">
          {open.slice(0, 5).map((t, i) => <li key={i} className="flex justify-between py-2.5"><span>{t.title}</span><span className="text-sm text-mute">{t.due_date ?? ""}</span></li>)}
          {!open.length && <li className="py-2.5 text-mute">No open tasks yet. The Checklist arrives in Phase 3.</li>}
        </ul>
      </section>
      <section className="mt-10 rounded-md bg-sage-soft p-4">
        <p className="text-sm text-sage-dark">Invite your partner: share this code. They choose “Joining your partner?” after signing up.</p>
        <p className="mt-1 font-mono text-lg">{w.invite_code}</p>
      </section>
    </div>);
}
