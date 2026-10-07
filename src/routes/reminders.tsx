import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { actions, notify, relTime, useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Your reminders — Misplaced" },
      { name: "description", content: "All your lost-item reminders in one list." },
      { property: "og:title", content: "Your reminders — Misplaced" },
      { property: "og:description", content: "Mark items found, test or delete reminders." },
    ],
  }),
  component: List,
});

function List() {
  const { reminders, settings } = useStore();
  return (
    <Shell>
      <div className="flex items-end justify-between">
        <h1 className="wipe font-display text-6xl">Reminders</h1>
        <Link to="/new" className="btn btn-solid">+ New</Link>
      </div>
      {reminders.length === 0 ? (
        <p className="rise mt-16 font-display text-3xl italic text-muted-foreground">Nothing lost yet. Lucky you.</p>
      ) : (
        <ul className="mt-10">
          {reminders.map((r, i) => (
            <li key={r.id} className="rise flex flex-wrap items-center gap-4 border-t py-5 last:border-b" style={{ animationDelay: `${i * 0.05}s` }}>
              <button
                aria-label="Mark found"
                onClick={() => actions.update(r.id, { done: !r.done })}
                className={`size-6 border transition-colors ${r.done ? "bg-foreground" : "hover:bg-muted"}`}
              />
              <div className={`flex-1 ${r.done ? "line-through opacity-50" : ""}`}>
                <p className="font-display text-3xl">{r.item}</p>
                <p className="text-sm text-muted-foreground">“{r.title}” — {r.message}</p>
              </div>
              <span className="label-mono">{r.done ? "found" : r.fired ? "sent" : relTime(r.time)}</span>
              <button className="btn !px-3 !py-1" onClick={() => notify(r.title, r.message, settings.sender) || toast.error("Allow notifications in Settings first")}>Test</button>
              <button className="btn !px-3 !py-1" onClick={() => actions.remove(r.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
