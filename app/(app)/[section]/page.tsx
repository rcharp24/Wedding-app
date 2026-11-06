import { notFound } from "next/navigation";
import { SECTIONS } from "@/components/Nav";
const PHASE: Record<string, string> = { map:"Phase 2", budget:"Phase 3", venues:"Phase 3", vendors:"Phase 3", checklist:"Phase 3", calendar:"Phase 3",
  guests:"Phase 4", seating:"Phase 4", "wedding-day":"Phase 5", inspiration:"Phase 5", documents:"Phase 5", website:"Phase 5", settings:"Phase 6" };
export default function Section({ params }: { params: { section: string } }) {
  const s = SECTIONS.find(([slug]) => slug === params.section);
  if (!s || params.section === "dashboard") return notFound();
  return <div><h1 className="font-display text-3xl">{s[1]}</h1>
    <p className="mt-2 text-mute">This section is built in {PHASE[params.section]}.</p></div>;
}
