import type { BusinessProfile } from '@/types';

/**
 * Gate logic for business actions.
 * Businesses MUST verify their ABN before posting shifts, messaging workers,
 * shortlisting, or hiring. This guard runs both client-side and (in production)
 * server-side via row-level security in Supabase.
 */
export const canBusinessAct = (b: BusinessProfile | null): { allowed: boolean; reason?: string } => {
  if (!b) return { allowed: false, reason: 'Business profile required.' };
  if (!b.abnVerified) {
    return {
      allowed: false,
      reason: 'Verify your ABN to post shifts, message workers, shortlist or hire.',
    };
  }
  if (!b.paymentSetup) {
    return { allowed: false, reason: 'Add a payment method before hiring.' };
  }
  return { allowed: true };
};
