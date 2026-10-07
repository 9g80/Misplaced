import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/Shell";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "New reminder — Misplaced" },
      { name: "description", content: "Create a custom reminder for something you lost." },
      { property: "og:title", content: "New reminder — Misplaced" },
      { property: "og:description", content: "Name it, title it, write the notification." },
    ],
  }),
  component: NewReminder,
});

const COMMON = [
  "Pencil case", "Homework", "PE kit", "Library book", "Water bottle",
  "Headphones", "Calculator", "Lunch box", "School ID", "Phone",
] as const;

function inMinutes(m: number) {
  const d = new Date(Date.now() + m * 60000 - new Date().getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 16);
}

function NewReminder() {
  const { settings } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ item: "", place: "", title: "", message: "", time: inMinutes(5) });
  const up = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.item.trim()) {
      toast.error("Give the item a name");
      return;
    }
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    actions.add({ ...f, title: f.title || `Find your ${f.item}`, message: f.message || `Last seen: ${f.place || "somewhere"}` });
    toast.success("Reminder saved");
    nav({ to: "/reminders" });
  };

  return (
    <Shell>
      <h1 className="wipe font-display text-6xl">New reminder</h1>
      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_320px]">
        <form onSubmit={save} className="space-y-7">
          <F label="Item name">
            <input className="field" placeholder="PE kit" value={f.item} onChange={up("item")} />
            <div className="mt-3 flex flex-wrap gap-2">
              {COMMON.map((c) => (
                <button type="button" key={c} className="btn !px-2.5 !py-0.5 !text-[0.65rem]" onClick={() => setF({ ...f, item: c })}>{c}</button>
              ))}
            </div>
          </F>
          <F label="Last seen at"><input className="field" placeholder="Locker 214, room 3B" value={f.place} onChange={up("place")} /></F>
          <F label="Notification title"><input className="field" placeholder={`Find your ${f.item || "PE kit"}`} value={f.title} onChange={up("title")} /></F>
          <F label="Notification message"><textarea rows={2} className="field resize-none" placeholder="Check your locker before class!" value={f.message} onChange={up("message")} /></F>
          <F label="Remind me at">
            <input type="datetime-local" className="field font-mono" value={f.time} onChange={up("time")} />
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 5, 30, 60].map((m) => (
                <button type="button" key={m} className="btn !px-3 !py-1" onClick={() => setF({ ...f, time: inMinutes(m) })}>+{m}m</button>
              ))}
            </div>
          </F>
          <button className="btn btn-solid">Save reminder →</button>
        </form>

        <aside className="rise" style={{ animationDelay: "0.3s" }}>
          <p className="label-mono mb-3">Preview</p>
          <div className="border p-4 shadow-[6px_6px_0_0_var(--foreground)]">
            <div className="flex justify-between label-mono"><span>{settings.sender}</span><span>now</span></div>
            <p className="mt-2 font-semibold">{f.title || `Find your ${f.item || "PE kit"}`}</p>
            <p className="text-sm text-muted-foreground">{f.message || `Last seen: ${f.place || "room 3B"}`}</p>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block rise"><span className="label-mono">{label}</span>{children}</label>;
}
