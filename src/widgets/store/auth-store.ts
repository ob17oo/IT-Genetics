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
    updateDNA: (amount: number) => void,
    purchaseItem: (price: number, effect: { type: string; value: number; skillName?: string; category?: string }, itemCategory?: string) => boolean,
    addSkillIfNotExists: (skillName: string, category: 'Hard' | 'Soft') => void,
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
            },
            updateDNA: (amount) => {
                set(state => ({
                    user: state.user ? {
                        ...state.user,
                        dna: Math.max(0, (state.user.dna || 0) + amount)
                    } : null
                }))
            },
            addSkillIfNotExists: (skillName, category) => {
                set(state => {
                    if (!state.user) return state;
                    
                    const skillExists = state.user.skills.some(skill => skill.name === skillName);
                    if (skillExists) return state;
                    
                    return {
                        user: {
                            ...state.user,
                            skills: [
                                ...state.user.skills,
                                {
                                    type: category,
                                    name: skillName,
                                    level: 0
                                }
                            ]
                        }
                    };
                });
            },
            purchaseItem: (price, effect, itemCategory) => {
                const state = get();
                if (!state.user) return false;
                
                const currentDNA = state.user.dna || 0;
                if (currentDNA < price) {
                    return false;
                }
                
                set((prevState) => {
                    if (!prevState.user) return prevState;
                    
                    let updatedSkills = [...prevState.user.skills];
                    

                    if (effect.type === 'skill-up' && effect.skillName) {
                        const skillIndex = updatedSkills.findIndex(s => s.name === effect.skillName);
                        if (skillIndex >= 0) {

                            updatedSkills[skillIndex] = {
                                ...updatedSkills[skillIndex],
                                level: Math.min(updatedSkills[skillIndex].level + effect.value, 10)
                            };
                        } else {

                            const category = (itemCategory as 'Hard' | 'Soft') || (effect.category as 'Hard' | 'Soft') || 'Hard';
                            updatedSkills.push({
                                type: category,
                                name: effect.skillName,
                                level: Math.min(effect.value, 10)
                            });
                        }
                    } else if (effect.type === 'skill-up-all') {

                        const category = (itemCategory as 'Hard' | 'Soft') || (effect.category as 'Hard' | 'Soft') || 'Hard';
                        updatedSkills = updatedSkills.map(skill => {
                            if (skill.type === category) {
                                return {
                                    ...skill,
                                    level: Math.min(skill.level + effect.value, 10)
                                };
                            }
                            return skill;
                        });
                    }
                    
                    return {
                        user: {
                            ...prevState.user,
                            dna: currentDNA - price,
                            skills: updatedSkills
                        }
                    };
                });
                
                return true;
            }
        }),
        {
            name: 'auth-storage'
        }
    )
)