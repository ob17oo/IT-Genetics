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
    updateSkillsLevel: (skillName: string, level: number) => void,
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
                const currentState = get()
                if(!currentState.user){
                    throw new Error('Пользователь не найден')
                }
                if(currentState.user.name === name && currentState.user?.surName === surName){
                    set({
                    isAuthenticated: true
                })
                } else {
                    throw new Error('Пользователь не авторизован')
                }
                
            },
            logOut: () => {
                set({
                    user: null,
                    isAuthenticated: false
                })
            },
            updateSkillsLevel: (skillsName, level) => {
                set(state => ({
                    user: state.user ? {
                        ...state.user,
                        skills: state.user.skills.map(skill => 
                            skill.name === skillsName 
                            ? {
                                ...skill,
                                level: Math.min(level, 10),
                            } : skill
                        )
                    } : null
                }))
            }
        }),
        {
            name: 'auth-storage'
        }
    )
)