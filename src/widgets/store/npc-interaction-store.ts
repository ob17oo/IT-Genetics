import { create } from "zustand";

interface NPCInteractionState {
  showPrompt: boolean;
  npcName: string | null;
  npcId: number | null;
  promptMessage: string | null; // Сообщение подсказки
  isDialogOpen: boolean;
  setInteraction: (show: boolean, npcName: string | null, npcId: number | null, promptMessage?: string | null) => void;
  clearInteraction: () => void;
  setDialogOpen: (isOpen: boolean) => void;
}

export const useNPCInteractionStore = create<NPCInteractionState>((set) => ({
  showPrompt: false,
  npcName: null,
  npcId: null,
  promptMessage: null,
  isDialogOpen: false,
  setInteraction: (show, npcName, npcId, promptMessage = null) =>
    set({ 
      showPrompt: show, 
      npcName, 
      npcId,
      promptMessage: promptMessage || `Нажми E` // Дефолтное сообщение
    }),
  clearInteraction: () => set({ showPrompt: false, npcName: null, npcId: null, promptMessage: null }),
  setDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
}));

