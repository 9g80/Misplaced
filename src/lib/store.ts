import { useSyncExternalStore } from "react";

export type Reminder = {
  id: string;
  item: string;
  place: string;
  title: string;
  message: string;
  time: string; // ISO datetime-local value
  done: boolean;
  fired: boolean;
};

export type Settings = {
  appName: string;
  userName: string;
  sender: string;
};

type State = { reminders: Reminder[]; settings: Settings };

const KEY = "misplaced-v1";
const defaults: State = {
  reminders: [],
  settings: { appName: "Misplaced", userName: "friend", sender: "Misplaced" },
};

let state: State = defaults;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...defaults, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function set(next: State) {
  state = next;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore() {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      cb();
      return () => listeners.delete(cb);
    },
    () => state,
    () => defaults,
  );
}

export const actions = {
  add(r: Omit<Reminder, "id" | "done" | "fired">) {
    load();
    set({ ...state, reminders: [{ ...r, id: crypto.randomUUID(), done: false, fired: false }, ...state.reminders] });
  },
  update(id: string, patch: Partial<Reminder>) {
    set({ ...state, reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  },
  remove(id: string) {
    set({ ...state, reminders: state.reminders.filter((r) => r.id !== id) });
  },
  settings(patch: Partial<Settings>) {
    load();
    set({ ...state, settings: { ...state.settings, ...patch } });
  },
  get: () => (load(), state),
};

export function notify(title: string, body: string, sender: string) {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission !== "granted") return false;
  new Notification(title, { body: `${body}\n— ${sender}` });
  return true;
}

export function startTicker() {
  const tick = () => {
    const s = actions.get();
    const now = Date.now();
    s.reminders.forEach((r) => {
      if (!r.fired && !r.done && r.time && new Date(r.time).getTime() <= now) {
        notify(r.title || r.item, r.message, s.settings.sender);
        actions.update(r.id, { fired: true });
      }
    });
  };
  tick();
  const id = setInterval(tick, 5000);
  return () => clearInterval(id);
}

export function relTime(iso: string) {
  const d = new Date(iso).getTime() - Date.now();
  const m = Math.round(Math.abs(d) / 60000);
  const txt = m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} d`;
  return d >= 0 ? `in ${txt}` : `${txt} ago`;
}
