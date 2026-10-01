// Runs before the page paints, so a saved dark preference does not flash light.
// Keep this in sync with ThemeToggle's storage key and accepted preferences.
export const themeInitScript = `
(function () {
  var preference = 'system';
  try {
    var saved = localStorage.getItem('linearlens-theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (_) {}
  var root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = preference === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preference;
})();
`;
