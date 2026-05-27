/**
 * ABN verification (Australian Business Register).
 *
 * This file ships a mock verifier so the UI works out of the box.
 * Swap `verifyAbnMock` with `verifyAbnLive` once you wire the ABR
 * Search API. Docs: https://abr.business.gov.au/Tools/WebServices
 *
 * Live flow:
 *   1. Register and get a GUID (free).
 *   2. Set ABR_GUID in your server env.
 *   3. Move the live call behind your backend (do NOT expose GUID client-side).
 */

export const formatAbn = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
};

export const isValidAbnFormat = (abn: string) => abn.replace(/\D/g, '').length === 11;

/** Mock: any 11-digit ABN succeeds. Replace before launch. */
export async function verifyAbnMock(abn: string): Promise<{ valid: boolean; entityName?: string }> {
  await new Promise((r) => setTimeout(r, 900));
  if (!isValidAbnFormat(abn)) return { valid: false };
  return { valid: true, entityName: 'Demo Verified Entity Pty Ltd' };
}
