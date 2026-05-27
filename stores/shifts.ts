import { create } from 'zustand';
import type { Shift, Application, ID } from '@/types';
import { mockShifts } from '@/lib/mockData';

interface ShiftState {
  shifts: Shift[];
  applications: Application[];
  addShift: (shift: Shift) => void;
  applyToShift: (shiftId: ID, workerId: ID, message?: string) => void;
  shortlist: (shiftId: ID, workerId: ID) => void;
  hire: (shiftId: ID, workerId: ID) => void;
  getById: (id: ID) => Shift | undefined;
}

export const useShifts = create<ShiftState>((set, get) => ({
  shifts: mockShifts,
  applications: [],
  addShift: (shift) => set((s) => ({ shifts: [shift, ...s.shifts] })),
  applyToShift: (shiftId, workerId, message) =>
    set((s) => {
      const shifts = s.shifts.map((sh) =>
        sh.id === shiftId && !sh.applicantIds.includes(workerId)
          ? { ...sh, applicantIds: [...sh.applicantIds, workerId] }
          : sh,
      );
      const app: Application = {
        id: `a_${Date.now()}`,
        shiftId,
        workerId,
        message,
        status: 'applied',
        appliedAt: new Date().toISOString(),
      };
      return { shifts, applications: [app, ...s.applications] };
    }),
  shortlist: (shiftId, workerId) =>
    set((s) => ({
      shifts: s.shifts.map((sh) =>
        sh.id === shiftId
          ? {
              ...sh,
              status: 'shortlisting',
              shortlistIds: Array.from(new Set([...sh.shortlistIds, workerId])),
            }
          : sh,
      ),
    })),
  hire: (shiftId, workerId) =>
    set((s) => ({
      shifts: s.shifts.map((sh) =>
        sh.id === shiftId
          ? { ...sh, status: 'hired', hiredWorkerId: workerId }
          : sh,
      ),
    })),
  getById: (id) => get().shifts.find((s) => s.id === id),
}));
