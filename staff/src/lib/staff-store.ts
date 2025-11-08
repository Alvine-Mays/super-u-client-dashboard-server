import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Staff = {
  id: string;
  email: string;
  role: 'admin'|'staff'|'customer'|'caissier'|'preparateur';
  name?: string;
};

interface StaffStore {
  staff: Staff | null;
  token: string | null;
  setAuth: (staff: Staff | null, token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  getToken: () => string | null;
}

export const useStaffStore = create<StaffStore>()(
  persist(
    (set, get) => ({
      staff: null,
      token: null,
      setAuth: (staff, token) => set({ staff, token }),
      logout: () => set({ staff: null, token: null }),
      isAuthenticated: () => get().staff !== null && get().token !== null,
      getToken: () => get().token,
    }),
    {
      name: 'staff-auth',
    }
  )
);

