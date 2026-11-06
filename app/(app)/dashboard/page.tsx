
const money = (n: number) =>
  Number(n).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function Dashboard() {
  // DEMO DATA - No Supabase account required
  const w = {
    name: "Our Wedding",
    wedding_date: "2027-10-16",
    location: "New Orleans, Louisiana",
    total_budget: 25000,
    invite_code: "DEMO2027",
  };

  const tasks = [
    { title: "Book wedding venue", due_date: "2027-01-15", done: true },
    { title: "Choose photographer", due_date: "2027-02-01", done: false },
    { title: "Finalize guest list", due_date: "2027-03-01", done: false },
    { title: "Send save-the-dates", due_date: "2027-04-01", done: false },
    { title: "Choose wedding attire", due_date: "2027-05-01", done: false },
  ];

  const exp = [
    { actual: 3500 },
    { actual: 1200 },
    { actual: 800 },
  ];

  const guests = [
    { invited: true, rsvp_status: "attending" },
    { invited: true, rsvp_status: "attending" },
    { invited: true, rsvp_status: "pending" },
    { invited: true, rsvp_status: "pending" },
    { invited: true, rsvp_status: "declined" },
  ];

  const days = Math.ceil(
    (new Date(w.wedding_date + "T00:00:00").getTime() - Date.now()) / 864e5
  );

  const spent = exp.reduce((s, e) => s + Number(e.actual), 0);
  const invited = guests.filter(g => g.invited).length;
  const yes = guests.filter(g => g.rsvp_status === "attending").length;
  const pending = guests.filter(
    g => g.invited && g.rsvp_status === "pending"
  ).length;

  const open = tasks.filter(t => !t.done);
  const done = tasks.length - open.length;
  const pct = Math.round((done / tasks.length) * 100);

  const stats: [string, string][] = [
    ["Total budget", money(w.total_budget)],
    ["Spent", money(spent)],
    ["Remaining", money(w.total_budget - spent)],
    ["Invited", String(invited)],
    ["Confirmed", String(yes)],
    ["Awaiting RSVP", String(pending)],
  ];

  return (
    <div className="max-w-4xl">
      <section className="border-b border-line pb-8">
        <h1 className="font-display text-4xl md:text-5xl">{w.name}</h1>
        <p className="mt-2 text-mute">
          {new Date(w.wedding_date + "T00:00").toLocaleDateString(
            undefined,
            { dateStyle: "long" }
          )} in {w.location}
        </p>
        <p className="mt-6 font-display text-6xl text-sage">
          {Math.max(0, days)}
          <span className="ml-3 font-sans text-lg text-mute">
            days to go
          </span>
        </p>
      </section>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {stats.map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm text-mute">{k}</dt>
            <dd className="font-display text-2xl">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl">Planning checklist</h2>
          <span className="text-sm text-mute">
            {done} of {tasks.length} done
          </span>
        </div>

        <div
          className="mt-2 h-2 rounded-full bg-line"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-2 rounded-full bg-sage"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ul className="mt-4 divide-y divide-line">
          {open.slice(0, 5).map((t, i) => (
            <li key={i} className="flex justify-between py-2.5">
              <span>{t.title}</span>
              <span className="text-sm text-mute">{t.due_date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-md bg-sage-soft p-4">
        <p className="text-sm text-sage-dark">
          Demo mode: This dashboard uses sample wedding information.
        </p>
        <p className="mt-1 font-mono text-lg">{w.invite_code}</p>
      </section>
    </div>
  );
}
