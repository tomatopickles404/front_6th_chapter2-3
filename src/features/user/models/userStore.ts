import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  userId: number | null
  username: string | null
  isLoggedIn: boolean
  setUser: (userId: number, username: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      username: null,
      isLoggedIn: false,
      setUser: (userId, username) => set({ userId, username, isLoggedIn: true }),
      logout: () => set({ userId: null, username: null, isLoggedIn: false }),
    }),
    {
      name: "user-storage", // 로컬 스토리지 키
    },
  ),
)
