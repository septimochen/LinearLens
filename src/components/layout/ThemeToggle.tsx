"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";
const storageKey = "linearlens-theme";
const changeEvent = "linearlens-theme-change";

function readPreference(): Theme {
  const preference = document.documentElement.dataset.themePreference;
  return preference === "light" || preference === "dark"
    ? preference
    : "system";
}

function applyTheme(preference: Theme) {
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  function update() {
    applyTheme(readPreference());
    onChange();
  }
  function syncStorage(event: StorageEvent) {
    if (event.key !== storageKey && event.key !== null) return;
    const preference = event.newValue;
    applyTheme(
      preference === "light" || preference === "dark" ? preference : "system",
    );
    onChange();
  }
  media.addEventListener("change", update);
  window.addEventListener(changeEvent, update);
  window.addEventListener("storage", syncStorage);
  // Recheck system appearance if it changed between the first paint and hydration.
  update();
  return () => {
    media.removeEventListener("change", update);
    window.removeEventListener(changeEvent, update);
    window.removeEventListener("storage", syncStorage);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    readPreference,
    () => "system" as Theme,
  );
  return (
    <select
      className="theme-select"
      aria-label="Theme"
      value={theme}
      onChange={(event) => {
        const preference = event.target.value as Theme;
        // Theme switching still works when browser storage is unavailable.
        try {
          window.localStorage.setItem(storageKey, preference);
        } catch {}
        applyTheme(preference);
        window.dispatchEvent(new Event(changeEvent));
      }}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
