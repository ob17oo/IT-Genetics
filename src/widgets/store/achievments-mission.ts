import { MOCK_ACHIEVMENTS } from "@/shared/constants";
import { Achievment } from "@/shared/types/achievmentType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AchievmentsStore{
    achievments: Achievment[],

    updateAchievmentsProgress: (achievmentId: number, progress: number) => void,
    completedAchievments: (achievmentId: number) => void,
    getAllAchievments: () => Achievment[],
}

export const useAchivmentsStore = create<AchievmentsStore>()(
    persist(
        (set,get) => ({
            achievments: MOCK_ACHIEVMENTS,

            updateAchievmentsProgress: (achievmentId , progress) => {
                set(state => ({
                    achievments: state.achievments.map(achivment => 
                        achivment.id === achievmentId 
                        ? {
                            ...achivment,
                            progress: Math.min(progress, 100),
                            completed: progress >= 100
                        } : achivment
                    )
                }))
            },

            completedAchievments: (achievmentId) => {
                set(state => ({
                    achievments: state.achievments.map(achievment =>
                        achievment.id === achievmentId 
                        ? {
                            ...achievment,
                            progress: 100,
                            completed: true
                        } : achievment
                    )
                }))
                const achievment = get().achievments.find(achiv => achiv.id === achievmentId)
                if(achievment){
                    console.log(`Достижение ${achievment.title} получена`)
                }
            },

            getAllAchievments: () => get().achievments,

        }),
        {
            name: 'achievment-store'
        }
    )
)