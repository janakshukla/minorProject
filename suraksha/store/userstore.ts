import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
enum UserRole {
    child,
    parent,
}

 export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}
interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: User) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() =>AsyncStorage),
        }
    )
);