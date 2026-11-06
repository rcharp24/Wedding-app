"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
export const SECTIONS = [["dashboard","Dashboard"],["map","Wedding Map"],["budget","Budget"],["venues","Venues"],["vendors","Vendors"],
 ["guests","Guest List"],["seating","Seating Chart"],["checklist","Checklist"],["calendar","Calendar"],["wedding-day","Wedding Day"],
 ["inspiration","Inspiration"],["documents","Documents"],["website","Wedding Website"],["settings","Settings"]] as const;
export default function Nav({ name }: { name: string }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  const links = (
    <nav className="space-y-0.5">{SECTIONS.map(([slug, label]) => {
      const on = path === `/${slug}`;
      return <Link key={slug} href={`/${slug}`} onClick={() => setOpen(false)} aria-current={on ? "page" : undefined}
        className={`block rounded-md px-3 py-2 text-[15px] ${on ? "bg-sage-soft font-medium text-sage-dark" : "text-mute hover:bg-sage-soft/60"}`}>{label}</Link>;
    })}</nav>);
  return (<>
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper px-4 py-3 md:hidden">
      <span className="font-display text-xl">{name}</span>
      <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </header>
    {open && <div className="fixed inset-x-0 top-[53px] z-10 max-h-[calc(100vh-53px)] overflow-y-auto bg-paper p-3 md:hidden">{links}</div>}
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-line p-5 md:block">
      <div className="mb-6 font-display text-2xl">{name}</div>{links}
    </aside></>);
}
