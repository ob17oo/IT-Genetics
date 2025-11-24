import { MOCK_MISSIONS } from "@/shared/constants";
import { Mission } from "@/shared/types/missionType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MissionStore {
    missions: Mission[],
    currentMission: Mission | null,


    updateMissionProgress: (missionId: number, progress: number) => void;
    completeMission: (missionId: number) => void;
    getMissionById: (id: number) => Mission | undefined;
    getCompletedMissions: () => Mission[];
    getActiveMissions: () => Mission[];
    getAllMissions: () => Mission[],

    resetCookie: () => void
}


export const useMissionStore = create<MissionStore>()(
    persist(
        (set,get) => ({
            missions: MOCK_MISSIONS,
            currentMission: null,

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
            getAllMissions: () => get().missions,
            getMissionById: (id) => get().missions.find(elem => elem.id === id),
            getCompletedMissions: () => get().missions.filter(elem => elem.completed),
            getActiveMissions: () => get().missions.filter(elem => !elem.completed),
            resetCookie: () => {
                set({
                    missions: MOCK_MISSIONS,
                    currentMission: null
                })
            }
        }),
        {
            name: 'mission-storage'
        }
    )
)