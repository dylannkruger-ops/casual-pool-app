export type Theme = 'light' | 'dark' | 'system';

const KEY = 'mote.theme';

export const readTheme = (): Theme => {
  const saved = localStorage.getItem(KEY);
  return saved === 'light' || saved === 'dark' ? saved : 'system';
};

const prefersDark = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const resolveTheme = (t: Theme) => (t === 'system' ? (prefersDark() ? 'dark' : 'light') : t);

/** One attribute on <html> drives every colour token. */
export const applyTheme = (t: Theme) => {
  document.documentElement.setAttribute('data-theme', resolveTheme(t));
  if (t === 'system') localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, t);
};

/** Keep "system" honest when the OS flips while the app is open. */
export const watchSystemTheme = (onChange: () => void) => {
  if (!window.matchMedia) return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
