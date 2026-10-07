import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";

const nav = [
  { to: "/", label: "Menu" },
  { to: "/reminders", label: "Reminders" },
  { to: "/new", label: "New" },
  { to: "/settings", label: "Settings" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { settings } = useStore();
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-display text-2xl italic">{settings.appName}</Link>
          <nav className="flex gap-5 font-mono text-xs uppercase tracking-wider">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="underline-offset-4 hover:underline"
                activeProps={{ className: "underline" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="overflow-hidden border-b" aria-hidden="true">
        <div className="marquee flex w-max gap-0 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          {[0, 1].map((i) => (
            <span key={i} className="whitespace-nowrap">
              &nbsp;Homework due tomorrow · PE kit · Library book · Water bottle · Headphones · Pencil case · Calculator · School ID · Homework due yesterday ·&nbsp;
            </span>
          ))}
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl justify-between px-5 py-4 label-mono">
          <span>{settings.appName} — a school project</span>
          <span>Saved on this device</span>
        </div>
      </footer>
    </div>
  );
}
