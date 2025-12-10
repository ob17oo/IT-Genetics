import { create } from "zustand";

interface MissionInteractionState {
    showPrompt: boolean,
    missionId: number | null,
    promptMessage: string | null,
    setInteraction: (show: boolean, missionId: number, promptMessage?: string) => void,
    clearInteraction: () => void
}

export const useMissionInteraction = create<MissionInteractionState>((set) => ({
    showPrompt: false,
    missionId: null,
    promptMessage: null,
    setInteraction: (show,missionId, promptMessage = 'Нажми Е') => set({
        showPrompt: show,
        missionId,
        promptMessage,
    }),
    clearInteraction: () => set({showPrompt: false, missionId: null, promptMessage: null})
}))