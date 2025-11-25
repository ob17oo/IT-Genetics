import { create } from "zustand";

interface NPCInteractionState {
  showPrompt: boolean;
  npcName: string | null;
  npcId: number | null;
  promptMessage: string | null; // Сообщение подсказки
  setInteraction: (show: boolean, npcName: string | null, npcId: number | null, promptMessage?: string | null) => void;
  clearInteraction: () => void;
}

export const useNPCInteractionStore = create<NPCInteractionState>((set) => ({
  showPrompt: false,
  npcName: null,
  npcId: null,
  promptMessage: null,
  setInteraction: (show, npcName, npcId, promptMessage = null) =>
    set({ 
      showPrompt: show, 
      npcName, 
      npcId,
      promptMessage: promptMessage || `Нажми E` // Дефолтное сообщение
    }),
  clearInteraction: () => set({ showPrompt: false, npcName: null, npcId: null, promptMessage: null }),
}));

