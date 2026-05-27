import { create } from 'zustand';
import type { Role, ID } from '@/types';

interface AuthState {
  userId: ID | null;
  role: Role | null;
  email: string | null;
  onboarded: boolean;
  // actions
  signIn: (params: { userId: ID; role: Role; email: string; onboarded: boolean }) => void;
  signOut: () => void;
  setRole: (role: Role) => void;
  setOnboarded: (v: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  userId: null,
  role: null,
  email: null,
  onboarded: false,
  signIn: ({ userId, role, email, onboarded }) =>
    set({ userId, role, email, onboarded }),
  signOut: () => set({ userId: null, role: null, email: null, onboarded: false }),
  setRole: (role) => set({ role }),
  setOnboarded: (v) => set({ onboarded: v }),
}));
