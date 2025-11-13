import { SkillsType, UserType } from "@/shared/types/userType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
    user: UserType | null,
    isAuthenticated: boolean,
    register: (userData: {
        name: string,
        surName: string,
        dream: string,
        dreamLevel: string,
        specialization: string
        level: string,
        skills: SkillsType[]
    }) => void,
    login: (name: string, surName: string) => void,
    logOut: () => void,
    // updateUser: (updates: Partial<UserType>) => void,
}

export const useAuthStore = create<AuthStore>()(
    persist (
        (set,get) => ({
            user: null,
            isAuthenticated: false,

            register: (userData) => {
                const newUser = {
                    id: Math.random().toString(36).substring(2,9),
                    name: userData.name,
                    surName: userData.surName,
                    level: userData.level,
                    dreamLevel: userData.dreamLevel,
                    dream: userData.dream,
                    dna: 100,
                    experience: 1,
                    skills: userData.skills,
                    specialization: userData.specialization
                };
                set({
                    user: newUser,
                    isAuthenticated: true
                })
            },
            login: (name: string, surName:string) => {
                const mockUser: UserType = {
                    id: Math.random().toString(36).substring(2, 9),
                    name: name,
                    surName: surName,
                    level: "Джуниор",
                    dreamLevel: "Тим лид",
                    dream: "Стать опытным разработчиком",
                    dna: 150,
                    experience: 1,
                    skills: [
                        {
                            type: "Hard" as const,
                            name: "JavaScript" as const,
                            level: 2
                        },
                        {
                            type: "Soft", 
                            name: "Коммуникабельность",
                            level: 3
                        }
                    ],
                    specialization: "Frontend"
                };
                set({
                    user: mockUser,
                    isAuthenticated: true
                })
            },
            logOut: () => {
                set({
                    user: null,
                    isAuthenticated: false
                })
            },
            // updateUser: () => {

            // }
        }),
        {
            name: 'auth-storage'
        }
    )
)