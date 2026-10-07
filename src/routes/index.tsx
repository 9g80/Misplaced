import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { relTime, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Misplaced — never lose your school stuff again" },
      { name: "description", content: "Set custom reminders and notifications so you never lose your pencil case, PE kit or homework again." },
      { property: "og:title", content: "Misplaced — never lose your school stuff again" },
      { property: "og:description", content: "Custom reminders and browser notifications for lost school stuff." },
    ],
  }),
  component: Home,
});

const menu = [
  { to: "/new", n: "01", t: "Log a lost item", d: "What went missing, where, and when to remind you." },
  { to: "/reminders", n: "02", t: "Your reminders", d: "Mark them found, test or delete them." },
  { to: "/settings", n: "03", t: "Customize", d: "App name, your name, notification sender." },
] as const;

function Home() {
  const { reminders, settings } = useStore();
  const open = reminders.filter((r) => !r.done);
  const next = [...open].filter((r) => !r.fired).sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <Shell>
      <p className="label-mono rise">Hello, {settings.userName}</p>
      <h1 className="wipe mt-3 font-display text-6xl leading-[0.95] md:text-8xl">
        Where did you<br />leave it <em>this</em> time?
      </h1>
      <p className="rise mt-5 max-w-md text-sm text-muted-foreground" style={{ animationDelay: "0.2s" }}>
        Pencil case, PE kit, headphones — log whatever went missing at school, and Misplaced pings you at the exact moment to go look.
      </p>

      <div className="mt-10 grid border md:grid-cols-3">
        <Stat k="Still missing" v={open.length} />
        <Stat k="Found" v={reminders.length - open.length} />
        <div className="p-5 rise" style={{ animationDelay: "0.3s" }}>
          <p className="label-mono">Next ping</p>
          <p className="mt-2 text-lg">{next ? `${next.item} · ${relTime(next.time)}` : "Nothing scheduled"}</p>
        </div>
      </div>

      <div className="mt-14">
        <p className="label-mono mb-3">Main menu</p>
        {menu.map((m, i) => (
          <Link
            key={m.to}
            to={m.to}
            className="group rise flex items-baseline gap-6 border-t py-6 transition-all last:border-b hover:bg-foreground hover:px-4 hover:text-background"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
            <span className="font-mono text-sm">{m.n}</span>
            <span className="font-display text-4xl md:text-5xl">{m.t}</span>
            <span className="ml-auto hidden text-sm opacity-70 md:block">{m.d}</span>
            <span className="font-mono transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div className="rise border-b p-5 md:border-b-0 md:border-r">
      <p className="label-mono">{k}</p>
      <p className="mt-1 font-display text-5xl">{String(v).padStart(2, "0")}</p>
    </div>
  );
}
