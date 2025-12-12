import { create } from "zustand";

interface MissionInteractionState {
  showMissionPrompt: boolean;
  npcId: number | null;
  missionId: number | null,
  promptMissionMessage: string | null;
  isDialogOpen: boolean;
  setInteraction: (show: boolean, missionId: number | null, promptMissionMessage?: string | null) => void;
  clearInteraction: () => void;
  setDialogOpen: (isOpen: boolean) => void;
}

export const useMissionInteractionStore = create<MissionInteractionState>((set) => ({
  showMissionPrompt: false,
  missionId: null,
  npcId: null,
  promptMissionMessage: null,
  isDialogOpen: false,
  setInteraction: (show, missionId, promptMissionMessage = null) =>
    set({ 
      showMissionPrompt: show,
        missionId,
      promptMissionMessage: promptMissionMessage || `Нажми E`
    }),
  clearInteraction: () => set({ showMissionPrompt: false, missionId: null, npcId: null, promptMissionMessage: null }),
  setDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
}));

