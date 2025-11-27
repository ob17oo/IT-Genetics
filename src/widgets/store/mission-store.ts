import { MOCK_MISSIONS } from "@/shared/constants";
import { Mission } from "@/shared/types/missionType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MissionStore {
    missions: Mission[],
    availableMission: Mission[]

    updateMissionProgress: (missionId: number, progress: number) => void;
    completeMission: (missionId: number) => void;
    getActiveMissions: () => Mission[];
    resetCookie: () => void
    getAvailableMissions: () => Mission[]
    assignMission: (missionid: number) => void,
    completeMissionWithRewards: (missionId: number) => void
}

const createMissionSeed = () => MOCK_MISSIONS.map(m => ({...m}))

export const useMissionStore = create<MissionStore>()(
    persist(
        (set,get) => ({
            missions: [],
            availableMission: createMissionSeed(),

            updateMissionProgress: (missionId, progress) => {
                set(state => ({
                    missions: state.missions.map(mission => 
                        mission.id === missionId 
                        ? {
                            ...mission,
                            progress: Math.min(Math.max(0, progress), 100), 
                            completed: progress >= 100
                        } : mission
                    )
                }))
            },

            completeMission: (missionId) => {
                set(state => ({
                missions: state.missions.map(mission =>
                    mission.id === missionId
                    ? { ...mission, progress: 100, completed: true }
                    : mission
                )
                }));
                
                const mission = get().missions.find(m => m.id === missionId);
                if (mission) {
                console.log(`✅ Миссия завершена: ${mission.title}`);
                }
            },
            getActiveMissions: () => get().missions.filter(elem => !elem.completed),
            resetCookie: () => {
                set({
                    missions: [],
                    availableMission: createMissionSeed(), 
                })
            },
            getAvailableMissions: () => get().availableMission,

            assignMission: (missionId) => {
                set((state) => {
                  const mission = state.availableMission.find((m) => m.id === missionId)
                  if (!mission) return state
                  return {
                    availableMission: state.availableMission.filter((m) => m.id !== missionId),
                    missions: [...state.missions, { ...mission, progress: 0, completed: false }],
                  }
                })
              },
            completeMissionWithRewards: (missionId) => {
                    const mission = get().missions.find((elem) => elem.id === missionId)
                    if(mission && !mission.completed){
                        set(state => ({
                            missions: state.missions.map(elem => 
                                elem.id === missionId ?
                                {...elem, progress: 100, completed: true} : elem
                        )
                        }))   
                        return mission.reward
                    }
                return 0
            }
        }),
        {
            name: 'mission-storage'
        }
    )
)