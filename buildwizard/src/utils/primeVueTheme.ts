const colors = {
  "--p-primary-color": "var(--p-violet-600)",
  "--p-primary-light-color": "var(--p-violet-400)",
  "--p-primary-dark-color": "var(--p-violet-800)",
  "--p-primary-text-color": "var(--p-violet-500)",
  "--p-primary-bg-color": "var(--p-violet-800)",
  "--p-checkbox-checked-hover-background": "var(--p-violet-400)",
  "--p-primary-hover-background": "var(--p-violet-600)",
  "--p-primary-hover-color": "var(--p-violet-400)",
  "--p-primary-active-color": "var(--p-violet-500)",
  "--p-primary-50": "var(--p-violet-50)",
  "--p-primary-100": "var(--p-violet-100)",
  "--p-primary-200": "var(--p-violet-200)",
  "--p-primary-300": "var(--p-violet-300)",
  "--p-primary-400": "var(--p-violet-400)",
  "--p-primary-500": "var(--p-violet-500)",
  "--p-primary-600": "var(--p-violet-600)",
  "--p-primary-700": "var(--p-violet-700)",
  "--p-primary-800": "var(--p-violet-800)",
  "--p-primary-900": "var(--p-violet-900)",
  "--p-primary-950": "var(--p-violet-950)",

  // Message colors
  "--p-message-info-background":
    "color-mix(in srgb, var(--p-violet-500), transparent 84%)",
  "--p-message-info-border-color":
    "color-mix(in srgb, var(--p-violet-700), transparent 64%)",
  "--p-message-info-color": "var(--p-violet-500)",
  "--p-message-info-shadow": "var(--p-violet-500)",

  "--p-message-contrast-background": "var(--p-neutral-600)",
  "--p-message-contrast-border-color":
    "color-mix(in srgb, var(--p-neutral-700), transparent 64%)",
  "--p-message-contrast-color": "var(--p-neutral-300)",
  "--p-message-contrast-shadow": "var(--p-neutral-500)",

  // ToggleSwitch colors
  "--p-toggleswitch-handle-disabled-background": "var(--p-neutral-600)",
};

export function setTheme() {
  for (const [key, value] of Object.entries(colors)) {
    document.documentElement.style.setProperty(key, value);
  }
}
