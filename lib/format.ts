import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const currency = (n: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }).format(n);

export const hourlyRate = (n: number) => `${currency(n)}/hr`;

export const dateLong = (iso: string) => format(parseISO(iso), 'EEE d MMM · h:mma');
export const dateShort = (iso: string) => format(parseISO(iso), 'd MMM');
export const time = (iso: string) => format(parseISO(iso), 'h:mma');
export const fromNow = (iso: string) => formatDistanceToNow(parseISO(iso), { addSuffix: true });

export const professionLabel = (p: string) =>
  p
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
