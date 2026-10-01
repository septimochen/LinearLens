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

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function ThemeIcon({ theme }: { theme: Theme }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {theme === "light" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </>
      ) : theme === "dark" ? (
        <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1a9 9 0 1 0 10 10Z" />
      ) : (
        <>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8m-4-4v4" />
        </>
      )}
    </svg>
  );
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    readPreference,
    () => "system" as Theme,
  );
  function chooseTheme(preference: Theme) {
    // Theme switching still works when browser storage is unavailable.
    try {
      window.localStorage.setItem(storageKey, preference);
    } catch {}
    applyTheme(preference);
    window.dispatchEvent(new Event(changeEvent));
  }
  return (
    <fieldset className="theme-switch">
      <legend className="theme-sr-only">Appearance</legend>
      {options.map((option) => (
        <label
          className="theme-choice"
          key={option.value}
          title={`${option.label} theme`}
        >
          <input
            className="theme-input"
            type="radio"
            name="theme"
            value={option.value}
            checked={theme === option.value}
            onChange={() => chooseTheme(option.value)}
          />
          <span className="theme-button">
            <ThemeIcon theme={option.value} />
            <span className="theme-sr-only">{option.label} theme</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
