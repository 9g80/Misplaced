import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/Shell";
import { actions, notify, useStore } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Misplaced" },
      { name: "description", content: "Customize the app name, your name and the notification sender." },
      { property: "og:title", content: "Settings — Misplaced" },
      { property: "og:description", content: "Make the reminder app your own." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { settings } = useStore();
  const [perm, setPerm] = useState("unknown");
  useEffect(() => setPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission), []);

  const ask = async () => {
    if (typeof Notification === "undefined") return;
    setPerm(await Notification.requestPermission());
  };

  const fields = [
    ["appName", "App name"],
    ["userName", "Your name"],
    ["sender", "Notification sender name"],
  ] as const;

  return (
    <Shell>
      <h1 className="wipe font-display text-6xl">Settings</h1>
      <div className="mt-10 max-w-xl space-y-7">
        {fields.map(([k, l]) => (
          <label key={k} className="block rise">
            <span className="label-mono">{l}</span>
            <input className="field" value={settings[k]} onChange={(e) => actions.settings({ [k]: e.target.value })} />
          </label>
        ))}
        <div className="rise border p-5">
          <p className="label-mono">Notifications</p>
          <p className="mt-1 text-lg">Status: <span className="font-mono">{perm}</span></p>
          <div className="mt-4 flex gap-3">
            <button className="btn btn-solid" onClick={ask}>Allow notifications</button>
            <button className="btn" onClick={() => notify("Test ping", "This is how reminders will look.", settings.sender) ? toast.success("Sent!") : toast.error("Notifications not allowed yet")}>Send test</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
