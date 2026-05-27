import { create } from 'zustand';
import type { WorkerProfile, BusinessProfile } from '@/types';
import { mockWorkers, mockBusinesses } from '@/lib/mockData';

interface ProfileState {
  worker: WorkerProfile | null;
  business: BusinessProfile | null;
  // seed with sample for demo purposes
  loadDemoWorker: () => void;
  loadDemoBusiness: () => void;
  setWorker: (w: WorkerProfile) => void;
  setBusiness: (b: BusinessProfile) => void;
  // ABN verification (mock)
  verifyAbn: (abn: string) => Promise<boolean>;
  clear: () => void;
}

export const useProfile = create<ProfileState>((set, get) => ({
  worker: null,
  business: null,
  loadDemoWorker: () => set({ worker: mockWorkers[0] }),
  loadDemoBusiness: () => set({ business: mockBusinesses[0] }),
  setWorker: (worker) => set({ worker }),
  setBusiness: (business) => set({ business }),
  verifyAbn: async (abn) => {
    // Mock: ABNs >= 11 digits become verified. Wire to ABR API later.
    await new Promise((r) => setTimeout(r, 900));
    const digits = abn.replace(/\D/g, '');
    const ok = digits.length === 11;
    const current = get().business;
    if (current) {
      set({ business: { ...current, abn, abnVerified: ok } });
    }
    return ok;
  },
  clear: () => set({ worker: null, business: null }),
}));
