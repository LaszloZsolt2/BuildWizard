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

  "--p-message-warn-background":
    "color-mix(in srgb, var(--p-yellow-500), transparent 84%)",
  "--p-message-warn-border-color":
    "color-mix(in srgb, var(--p-yellow-700), transparent 64%)",

  "--p-message-error-background":
    "color-mix(in srgb, var(--p-red-500), transparent 84%)",
  "--p-message-error-border-color":
    "color-mix(in srgb, var(--p-red-700), transparent 64%)",

  "--p-message-success-background":
    "color-mix(in srgb, var(--p-green-500), transparent 84%)",
  "--p-message-success-border-color":
    "color-mix(in srgb, var(--p-green-700), transparent 64%)",

  "--p-message-secondary-background": "var(--p-neutral-800)",
  "--p-message-secondary-border-color":
    "color-mix(in srgb, var(--p-neutral-600), transparent 64%)",
  "--p-message-secondary-color": "var(--p-neutral-400)",

  // ToggleSwitch colors
  "--p-toggleswitch-handle-disabled-background": "var(--p-neutral-600)",
  "--p-toggleswitch-handle-checked-background": "var(--p-neutral-300)",
  "--p-toggleswitch-background": "var(--p-neutral-700)",

  // Button colors
  "--p-button-primary-color": "var(--p-neutral-200)",
  "--p-button-primary-hover-color": "var(--p-neutral-100)",
  "--p-button-primary-active-color": "var(--p-neutral-100)",
  "--p-button-primary-background": "var(--p-violet-700)",
  "--p-button-primary-hover-background": "var(--p-violet-600)",
  "--p-button-primary-active-background": "var(--p-violet-500)",

  "--p-button-text-secondary-hover-background": "var(--p-neutral-600)",
  "--p-button-text-secondary-active-background": "var(--p-neutral-500)",
  "--p-button-text-secondary-active-color": "var(--p-neutral-100)",
  "--p-button-text-secondary-color": "var(--p-neutral-400)",
  "--p-button-secondary-active-background": "var(--p-neutral-500)",
  "--p-button-secondary-active-color": "var(--p-neutral-200)",
  "--p-button-secondary-active-border-color": "var(--p-neutral-500)",
  "--p-button-secondary-background": "var(--p-neutral-700)",
  "--p-button-secondary-color": "var(--p-neutral-300)",
  "--p-button-secondary-border-color": "var(--p-neutral-600)",
  "--p-button-secondary-hover-border-color": "var(--p-neutral-500)",
  "--p-button-secondary-hover-color": "var(--p-neutral-200)",
  "--p-button-secondary-hover-background": "var(--p-neutral-600)",

  "--p-button-success-color": "var(--p-neutral-200)",
  "--p-button-success-hover-color": "var(--p-neutral-100)",
  "--p-button-success-active-color": "var(--p-neutral-100)",
  "--p-button-success-background": "var(--p-green-700)",
  "--p-button-success-hover-background": "var(--p-green-600)",
  "--p-button-success-active-background": "var(--p-green-500)",

  "--p-button-warn-color": "var(--p-neutral-200)",
  "--p-button-warn-hover-color": "var(--p-neutral-100)",
  "--p-button-warn-active-color": "var(--p-neutral-100)",
  "--p-button-warn-background": "var(--p-yellow-700)",
  "--p-button-warn-hover-background": "var(--p-yellow-600)",
  "--p-button-warn-active-background": "var(--p-yellow-500)",

  "--p-button-danger-color": "var(--p-neutral-200)",
  "--p-button-danger-hover-color": "var(--p-neutral-100)",
  "--p-button-danger-active-color": "var(--p-neutral-100)",
  "--p-button-danger-background": "var(--p-red-800)",
  "--p-button-danger-hover-background": "var(--p-red-700)",
  "--p-button-danger-active-background": "var(--p-red-600)",

  "--p-button-contrast-background": "var(--p-neutral-300)",
  "--p-button-contrast-hover-background": "var(--p-neutral-200)",
  "--p-button-contrast-active-background": "var(--p-neutral-100)",

  "--p-button-raised-shadow": "var(--p-red-500)",

  // Input colors
  "--p-inputtext-background": "var(--p-neutral-900)",
  "--p-inputtext-border-color": "var(--p-neutral-700)",
  "--p-inputtext-color": "var(--p-neutral-100)",
  "--p-inputtext-placeholder-color": "var(--p-neutral-400)",

  "--p-autocomplete-overlay-background": "var(--p-neutral-900)",
  "--p-autocomplete-option-focus-background": "var(--p-neutral-800)",
  "--p-autocomplete-option-color": "var(--p-neutral-200)",
  "--p-autocomplete-option-focus-color": "var(--p-neutral-100)",
  "--p-autocomplete-overlay-border-color": "var(--p-neutral-700)",
  "--p-autocomplete-overlay-color": "var(--p-neutral-300)",

  // Skeleton colors
  "--p-skeleton-background": "rgba(51, 51, 51, 0.7)",
  "--p-skeleton-animation-background": "rgba(64, 64, 64, 0.7)",

  // Dialog colors
  "--p-dialog-background": "var(--p-neutral-900)",
  "--p-dialog-border-color": "var(--p-neutral-700)",
  "--p-dialog-color": "var(--p-neutral-100)",

  // Select colors
  "--p-select-background": "var(--p-neutral-900)",
  "--p-select-color": "var(--p-neutral-200)",
  "--p-select-border-color": "var(--p-neutral-700)",
  "--p-select-option-color": "var(--p-neutral-200)",
  "--p-select-option-focus-color": "var(--p-neutral-100)",
  "--p-select-placeholder-color": "var(--p-neutral-400)",
  "--p-select-focus-border-color": "var(--p-violet-500)",
  "--p-select-overlay-background": "var(--p-neutral-800)",
  "--p-select-item-hover-background": "var(--p-neutral-800)",
  "--p-select-item-focus-background": "var(--p-neutral-700)",
  "--p-select-item-color": "var(--p-neutral-200)",
  "--p-select-option-focus-background": "var(--p-neutral-700)",
  "--p-select-option-hover-background": "var(--p-neutral-700)",
  "--p-select-option-selected-focus-color": "var(--p-neutral-200)",
  "--p-select-option-selected-focus-background": "var(--p-neutral-800)",
  "--p-select-option-selected-background": "var(--p-neutral-800)",
  "--p-select-option-selected-color": "var(--p-neutral-200)",
  "--p-select-disabled-background": "var(--p-neutral-600)",
  "--p-select-disabled-color": "var(--p-neutral-400)",
};

export function setTheme() {
  for (const [key, value] of Object.entries(colors)) {
    document.documentElement.style.setProperty(key, value);
  }
}
